'use server'

import bcrypt from 'bcryptjs'
import { sql } from '@/lib/db'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { registerSchema, loginSchema } from '@/lib/validations/auth'
import { RegisterState, LoginState } from '@/types/auth'
import { redirect } from 'next/navigation'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret')

// --- REGISTER ---
export async function registerUser(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const rawData = Object.fromEntries(formData.entries())
  const validatedFields = registerSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors as any,
      message: 'Please check your input and try again.'
    }
  }

  const { name, username, email, password, phone_number } = validatedFields.data

  try {
    // 1. Cek duplikasi
    const existingUsers = await sql`
      SELECT username, email, phone_number FROM users 
      WHERE username = ${username} 
      OR email = ${email} 
      OR (phone_number IS NOT NULL AND phone_number = ${phone_number || ''})
      LIMIT 1
    `

    if (existingUsers.length > 0) {
      const conflict = existingUsers[0]
      if (conflict.username === username) return { success: false, message: 'This username is already taken.' }
      if (conflict.email === email) return { success: false, message: 'This email address is already registered.' }
      if (conflict.phone_number === phone_number) return { success: false, message: 'This phone number is already registered.' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    // 2. Insert (Role default ke 'customer' dari schema, tapi kita ambil saat RETURNING)
    const [newUser] = await sql`
      INSERT INTO users (name, username, email, password, phone_number)
      VALUES (${name}, ${username}, ${email}, ${hashedPassword}, ${phone_number || null})
      RETURNING id, name, username, role
    `

    // 3. Token
    const token = await new SignJWT({ 
        userId: newUser.id.toString(), 
        username: newUser.username,
        name: newUser.name,
        role: newUser.role
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    const cookieStore = await cookies()
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return {
      success: true,
      message: 'Registration successful!',
      user: { name: newUser.name, username: newUser.username, role: newUser.role }
    }

  } catch (error) {
    console.error('Registration Error:', error)
    return { success: false, message: 'A database error occurred. Please try again.' }
  }
}

// --- LOGIN ---
export async function loginUser(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const rawData = Object.fromEntries(formData.entries())
  const validatedFields = loginSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors as any,
      message: 'Invalid credentials format.'
    }
  }

  const { identifier, password } = validatedFields.data

  try {
    const [user] = await sql`
      SELECT id, name, username, password, role FROM users 
      WHERE username = ${identifier} OR email = ${identifier} 
      LIMIT 1
    `

    if (!user) {
      return { success: false, message: 'User not found or incorrect credentials.' }
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return { success: false, message: 'User not found or incorrect credentials.' }
    }

    const token = await new SignJWT({ 
        userId: user.id.toString(), 
        username: user.username,
        name: user.name,
        role: user.role
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    const cookieStore = await cookies()
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return {
      success: true,
      message: 'Login successful!',
      user: { name: user.name, username: user.username, role: user.role }
    }

  } catch (error) {
    console.error('Login Error:', error)
    return { success: false, message: 'A system error occurred.' }
  }
}

// --- LOGOUT ---
export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete('session_token')
  redirect('/auth')
}
