$("form").submit((e) => {
  e.preventDefault();
  var name = $("#name").val();
  var category = $("#category").val();
  var image = $("#image").val();
  var price = $("#price").val();
  var stockCount = $("#stockCount").val();
  var subCategories = $("#subCategories").val();
  var desc = $("#desc").val();

  subCategories = subCategories.split(",");
  subCategories = subCategories.map((element) => element.trim());

  const data = {
    name,
    category,
    price,
  };

  if (image) data.image = image;
  if (stockCount) data.stockCount = stockCount;
  if (subCategories) data.subCategories = subCategories;
  if (desc) data.desc = desc;

   
});
