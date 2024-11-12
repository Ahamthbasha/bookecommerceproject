const Product=require("../../models/productModel")
const Category=require("../../models/categoryModel")

const getProduct=async(req,res)=>{
    try{
        var page=1
        if(req.query.page){
            page=req.query.page
        }
        const limit=10
        const productData=await Product.aggregate([
            {
                $lookup:{
                    from:"categories",
                    localField:"category",
                    foreignField:"_id",
                    as:"category",
                },
            },
            {
                $unwind:"$category",
            },
            {
                $limit:limit*1
            }
        ]);
        const count=await Product.find({}).countDocuments();
        // console.log(count)

        const totalPages=Math.ceil(count/limit)
        const pages=Array.from({length:totalPages},(_, i)=>i+1)

        res.render("admin/products",{productData,pages,currendtPage:page,layout:'adminlayout'})

    }catch(error){
        console.log(error)
    }
}

//add product page

const addProductPage=async(req,res)=>{
    try{
        const category=await Category.find({}).lean()

        res.render("admin/addproduct",{layout:"adminlayout",category})

    }catch(error){
        console.log(error)
    }
}

//post add product page

const addNewProduct=async(req,res)=>{
    try{
        const files=req.files
        const images=[]

        files.forEach((file)=>{
            const image=file.filename
            images.push(image)
        })

        const product=new Product({
            name:req.body.name,
            price:req.body.price,
            description:req.body.description,
            category:req.body.category,
            stock:req.body.stock,
            imageUrl:images,
        })

        await product.save()
        req.session.productsave=true
        res.redirect("/admin/product")
    }catch(error){
        console.log(error)
    }
}

/// To edit Product ///

const editProduct = async (req, res) => {
    try {
      let proId = req.params.id;
  
      const proData = await Product.findById({ _id: proId }).lean()
      const catogories = await Category.find({ isListed: true }).lean()
      
  
      console.log(".........................................................oo", proData);
      console.log(catogories);
  
  
      res.render("admin/edit_product", {proData, catogories, layout: 'adminlayout' })
    } catch (error) {
      console.log(error);
    }
  };
  
  /// To update Product post///
  
  const updateProduct = async (req, res) => {
    try {
      const proId = req.params.id;
      const product = await Product.findById(proId);
      const exImage = product.imageUrl;
      const files = req.files;
      let updImages = [];
  
      if (files && files.length > 0) {
        const newImages = req.files.map((file) => file.filename);
        updImages = [...exImage, ...newImages];
        product.imageUrl = updImages;
      } else {
        updImages = exImage;
      }
  
      const { name, price, description, category, stock, brand } = req.body;
      await Product.findByIdAndUpdate(
        proId,
        {
          name: name,
          price: price,
          description: description,
          category: category,
          stock: stock,
          is_blocked: false,
  
          imageUrl: updImages,
        },
        { new: true }
      );
  
      // req.session.productSave = true
      res.redirect("/admin/product");
    } catch (error) {
      console.log(error);
    }
  };
  
  /// To delete Product ///
  
  const deleteProduct = async (req, res) => {
    const proId = req.params.id;
    await Product.findByIdAndDelete(proId)
    res.redirect('/admin/product')

  };
  
  const blockProduct = async (req, res) => {
    const id = req.body.id
    // const proId = req.params.id;
    const prodData = await Product.findById(id);
    const isBlocked = prodData.is_blocked;
  
    const proData = await Product.findByIdAndUpdate(
      id,
      { $set: { is_blocked: !isBlocked } },
      { new: true }
    );
  
    res.redirect("/admin/product");
    req.session.proDelete = true;
  };

module.exports={
    getProduct,
    addProductPage,
    addNewProduct,
    editProduct,
    updateProduct,
    deleteProduct,
    blockProduct
}