import Category from "../models/categorymodel.js";
import categoryService from "../service/category.service.js";


const categoryController = {
    addCategory: async (req, res) => {
        try {
            const response = await  categoryService.addCategory(req.body.name,req.body.description);
            return res.status(201).json({
                status:true,
                messsage:"Category Created Successfully",
                date:response
            })
        } catch (err) {
            return res.status(error.statusCode || '500').json({
                status: false,
                error: error.message
            })
        }
    },

    
    getCategoryById: async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid Id"
                })
            }
            const category = await Category.findById(req.params.id);
            if (!category) {
                return res.status(404).json({
                    status: false,
                    message: "Category Not exist With This Id"
                })
            }
            return res.status(200).json({
                status: false,
                message: "Category Reterived Succcessfully",
                data:category
            })
        } catch (err) {
            return res.status(error.statusCode || '500').json({
                status: false,
                error: error.message
            })
        }
    },

    getAllCategory: async (req, res) => {
        try {
            console.log("sdhfkj")
            const category = await Category.find();
            return res.status(200).json({
                status: true,
                message: "Category retrived Successfully",
                data: category
            })
        } catch (err) {
            return res.status(err.statusCode || 500).json({
                error: err.message || "Internal Server Error"
            })
        }
    }
}


export default categoryController;