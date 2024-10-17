import Category from "../models/categorymodel.js";

const categoryService = {
    addCategory: async (name,description) => {
        const category = await Category.findOne({ name })
        if (category) {
            return {
                status: false,
                message: "category Already Exist",
                data: {}
            }
        }
        const newcategory = new Category({
            name,
            description
        })
        await newcategory.save();
        return {
            status: true,
            message: "Category created Successfully",
            data: newcategory
        }
    },

    categoryByName:async(categoryname)=>{
        const category = await Category.findOne({name:categoryname});
        return category;
     }
}

export default categoryService;