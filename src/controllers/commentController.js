const { supabase } = require('../config/supabase');

const addComment = async (req, res) => {
  const { recipe_id } = req.params;
  const { content } = req.body;

  if (!content) return res.status(400).json({ error: 'Content is required' });

  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([{
        content,
        recipe_id,
        user_id: req.user.id
      }])
      .select('*, profiles(username)');

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.user_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { addComment, deleteComment };
