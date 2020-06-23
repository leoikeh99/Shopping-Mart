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

  //   $.ajax({
  //     type: "GET",
  //     headers: {
  //       "Access-Control-Allow-Origin": "http://localhost:5500/",
  //     },
  //     url: "https://shopping-mart-app.herokuapp.com/api/products",
  //     crossDomain: true,
  //     sucess: (data) => {
  //       console.log(data);
  //     },
  //     error: (xhr) => {
  //       console.log("status: ", xhr.status, " Error message: ", xhr.responseText);
  //     },
  //   });
});
