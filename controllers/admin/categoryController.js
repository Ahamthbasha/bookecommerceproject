const Category=require("../../models/categoryModel")

let catSaveMsg = "Category added suceessfully..!!";

/// To get category page ///

const getCategory = async (req, res) => {
    try {
      var page = 1
      if (req.query.page) {
        page = req.query.page
      }
      const limit = 3;
      let allCtegoryData = await Category.find()
        .skip((page - 1) * limit)
        .limit(limit * 1)
        .lean();
      const count = await Category.find({}).countDocuments();
      const totalPages = Math.ceil(count / limit)
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
      let catUpdtMsg = "Category updated successfully..!!";
  
      if (req.session.categoryUpdate) {
        res.render("admin/category", { allCtegoryData, pages, currentPage: page, catUpdtMsg, layout: 'adminlayout' });
        req.session.categoryUpdate = false;
      } else {
        res.render("admin/category", { allCtegoryData, pages, currentPage: page, layout: 'adminlayout' });
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  /// To get add category page ///
  
  const addCategory = (req, res) => {
    try {
      let catExistMsg = "Category alredy Exist..!!";
  
      if (req.session.categorySave) {
        res.render("admin/add_category", { catSaveMsg, layout: 'adminlayout' });
        req.session.categorySave = false;
      } else if (req.session.catExist) {
        res.render("admin/add_category", { catExistMsg, layout: 'adminlayout' });
        req.session.catExist = false;
      } else {
        res.render("admin/add_category", { layout: 'adminlayout' });
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  /// To add new category post///
  
  const addNewCategory = async (req, res) => {
    const catName = req.body.name;
    const image = req.file;
    const lCatName = catName;
  
    try {
      const catExist = await Category.findOne({ category: { $regex: new RegExp("^" + lCatName + "$", "i") } });
      if (!catExist) {
        const category = new Category({
          category: lCatName,
          imageUrl: image.filename,
        });
  
        await category.save();
        req.session.categorySave = true;
        res.redirect("/admin/add_category");
      } else {
        req.session.catExist = true;
        res.redirect("/admin/add_category");
      }
    } catch (error) { }
    
  };
  
  /// To edit category ///
  
  const editCategory = async (req, res) => {
    let catId = req.params.id;
  
    try {
      const catData = await Category.findById({ _id: catId }).lean();
  
      if (req.session.catExist) {
        res.render("admin/edit_category", { catData, catExistMsg, layout: 'adminlayout' });
        // req.session.catExist = false
      } else {
        res.render("admin/edit_category", { catData, layout: 'adminlayout' });
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  
  
  const updateCategory = async (req, res) => {
    try {
      const catName = req.body.name;
      const image = req.file;
      const catId = req.params.id;
  
      const cat = await Category.findById(catId);
      const catImg = cat.imageUrl;
      let updImge;
  
      if (image) {
        updImge = image.filename;
      } else {
        updImge = catImg;
      }
  
  
      const catExist = await Category.findOne({ category: { $regex: new RegExp("^" + catName + "$", "i") } });
  
      if (!catExist) {
        await Category.findByIdAndUpdate(
          catId,
          {
            category: req.body.name,
            imageUrl: updImge,
          },
          { new: true }
        );
  
        req.session.categoryUpdate = true;
        res.redirect("/admin/category");
      } else {
        // req.session.catExist = true
        res.redirect("/admin/category");
      }
    } catch (error) { }
  };
  
  
  
  const deleteCategory = async (req, res) => {
    try {
      const id = req.body.id
      // const catId = req.params.id
      let user = await Category.findById(id)
      let newListed = user.isListed
  
      await Category.findByIdAndUpdate(id, {
        isListed: !newListed
      },
        { new: true })
  
      res.redirect('/admin/category')
  
  
  
    } catch (error) {
      console.log(error)
  
    }
  }
module.exports={getCategory,addCategory,addNewCategory,editCategory,updateCategory,deleteCategory}