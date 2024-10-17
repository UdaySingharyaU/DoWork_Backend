import Service from "../models/service.model.js"


const allServices={
    serviceByname:async(servicename)=>{
       const service = await Service.findOne({name:servicename});
       return service;
    }
}


export default allServices;