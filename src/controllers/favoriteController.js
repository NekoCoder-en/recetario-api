const { supabase } = require('../config/supabase');

const toggleFavorite = async (req, res) => {
  const { recipe_id } = req.params;
  const user_id = req.user.id;

  try {
    // Check if already favorited
    const { data: existing, error: checkError } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user_id)
      .eq('recipe_id', recipe_id)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existing) {
      // Remove favorite
      const { error: removeError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user_id)
        .eq('recipe_id', recipe_id);

      if (removeError) throw removeError;
      return res.json({ message: 'Removed from favorites' });
    } else {
      // Add favorite
      const { error: addError } = await supabase
        .from('favorites')
        .insert([{ user_id, recipe_id }]);

      if (addError) throw addError;
      return res.json({ message: 'Added to favorites' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMyFavorites = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('recipes(*, profiles(username))')
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json(data.map(f => f.recipes));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { toggleFavorite, getMyFavorites };
