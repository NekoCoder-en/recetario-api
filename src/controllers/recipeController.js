const { supabase, supabaseAdmin } = require('../config/supabase');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const getAllRecipes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*, profiles!user_id(username), comments(*, profiles!user_id(username))');

    if (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
    res.json(data);
  } catch (error) {
    console.error('Catch-all error in getAllRecipes:', error);
    res.status(500).json({ error: error.message });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*, profiles!user_id(username), comments(*, profiles!user_id(username))')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: 'Recipe not found' });
  }
};

const createRecipe = async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  try {
    let image_url = null;

    if (file) {
      const fileName = `${Date.now()}_${file.originalname}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recipe-photos')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-photos')
        .getPublicUrl(fileName);
      
      image_url = publicUrl;
    }

    const { data, error } = await supabase
      .from('recipes')
      .insert([{ 
        title, 
        description, 
        image_url, 
        user_id: req.user.id 
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const file = req.file;

  try {
    // Check ownership
    const { data: recipe, error: fetchError } = await supabase
      .from('recipes')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !recipe) return res.status(404).json({ error: 'Recipe not found' });
    if (recipe.user_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    let updates = { title, description };
    
    if (file) {
      const fileName = `${Date.now()}_${file.originalname}`;
      const { error: uploadError } = await supabase.storage
        .from('recipe-photos')
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-photos')
        .getPublicUrl(fileName);
      
      updates.image_url = publicUrl;
    }

    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  const { id } = req.params;

  try {
    // Check ownership
    const { data: recipe, error: fetchError } = await supabase
      .from('recipes')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !recipe) return res.status(404).json({ error: 'Recipe not found' });
    if (recipe.user_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { 
  getAllRecipes, 
  getRecipeById, 
  createRecipe, 
  updateRecipe, 
  deleteRecipe,
  upload
};
