import Para from './model.js';

const getpara = async (req, res) => {
    try {
        const para = await Para.find();
        res.status(200).send(para);
    } catch (error) {
        res.status(500).send(error);
    }
};

export default getpara;
