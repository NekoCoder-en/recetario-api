const { supabase, supabaseAdmin } = require('../config/supabase');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, password and username are required' });
  }

  try {
    // 1. Sign up user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // 2. Create profile in the profiles table
      // Use supabaseAdmin to bypass RLS during registration
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([{ id: data.user.id, username }]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }
    }

    res.status(201).json({ message: 'User registered successfully', user: data.user });
  } catch (error) {
    console.error('Registration error details:', error);
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Generate our own JWT if we want to add extra info, 
    // but we can also use data.session.access_token directly.
    // The user requested "jwt", so I'll generate one for the API to verify.
    const token = jwt.sign(
      { id: data.user.id, email: data.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      supabase_token: data.session.access_token,
      user: data.user
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { register, login };
