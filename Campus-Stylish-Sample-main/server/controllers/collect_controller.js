const { getCollectsByUserId, getCollectsByProductId, getCollectStatus, updateCollectStatus, getHotCollects } = require('../models/collect_model');
const { getProductsImages,getProductById } = require('../models/product_model');

const getAmount = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400);
        throw new Error('please add /:id in the request route');
    }
    const { collectCount } = await getCollectsByProductId(id);
    res.status(200).json({ count: collectCount });
};

const addToWhistlist = async (req, res) => {
    const { productId } = req.body;
    if (!productId) {
        res.status(400);
        throw new Error('please add product id.');
    }
    const result = await updateCollectStatus(req.user.id, productId, 'add');
    res.status(200).json(result);
};

const RemoveFromWhistlist = async (req, res) => {
    const { productId } = req.body;
    if (!productId) {
        res.status(400);
        throw new Error('please add product id.');
    }
    const result = await updateCollectStatus(req.user.id, productId, 'delete');
    res.status(200).json(result);
};

const getTrending = async (req, res) => {
    const { n } = req.params;
    const { result } = await getHotCollects(n);
    for (let i =0;i<result.length;i++){
        result[i].img = await getProductsImages(result[i].product_id)
        result[i].detail = await getProductById(result[i].product_id)
    }
    
    res.status(200).json(result);
};
const getUserWhistlist = async(req,res)=>{
    const result = await getCollectsByUserId(req.user.id)
    res.status(200).json(result)
}
module.exports = {
    getUserWhistlist,
    RemoveFromWhistlist,
    getAmount,
    addToWhistlist,
    getTrending,
};
