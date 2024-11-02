import Category from "../models/categorymodel.js";
import Service from "../models/service.model.js";

const categoryService = {
    addCategory: async (name,description,serviceName) => {
        const category = await Category.findOne({ name })
        console.log(category)
        if (category) {
            return {
                status: false,
                message: "category Already Exist",
                data: {}
            }
        }
        const existService = await Service.findOne({name:serviceName})
        if (!existService) {
            return {
                status: false,
                message: "Service Does Not  Exist",
                data: {}
            }
        }
        const newcategory = new Category({
            name,
            description,
            serviceId:existService._id
        })
        await newcategory.save();
        existService.categories.push(newcategory._id);
        await existService.save();
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