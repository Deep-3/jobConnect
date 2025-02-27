const db=require('../models');

exports.getMessage=async(req,res)=>{
    try {
        const message=await db.Community.findAll({
            limit:20
        })
    
        res.json({
            success: true,
            message 
          });
    }catch(error)
    {
        console.error('Error fetching messages:', error);
        res.status(500).json({
          success: false,
          error: 'Failed to fetch messages'
        });
    }
}

exports.addMessage=async(req,res)=>{

    const { userId, userName, text } = req.body;

    try
    {
        const message = await db.Community.create({
            userId,
            userName,
            text
          });
      
          res.json({ success: true, message });
    }
    catch(error)
    {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to save message' 
          });
    }
}