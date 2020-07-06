$(document).ready(() => {
  var spinner = $("#spinner");
  var response = document.querySelector(".response");
  $("form").submit((e) => {
    e.preventDefault();
    var name = $("#name").val();
    var category = $("#category").val();
    var image = $("#image").val();
    var price = $("#price").val();
    var stockCount = $("#stockCount").val();
    var subCategories = $("#subCategories").val();
    var desc = $("#desc").val();
    var username = $("#username").val();
    var password = $("#password").val();

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

    spinner.css("display", "block");

    //post request with ajax
    $.ajax({
      type: "POST",
      url: `/api/products?userName=${username}&password=${password}`,
      data: JSON.stringify(data),
      contentType: "application/json",

      //on success
      success: (data) => {
        spinner.css("display", "none");
        response.style.display = "block";
        response.textContent = "Product added";
        response.classList.add("alert");
        response.classList.add("alert-success");
        setTimeout(() => {
          response.style.display = "none";
        }, 4000);
      },

      //on error
      error: (xhr) => {
        spinner.css("display", "none");
        response.style.display = "block";
        response.textContent = `${xhr.responseJSON.msg}`;
        response.classList.add("alert");
        response.classList.add("alert-danger");
        setTimeout(() => {
          response.style.display = "none";
        }, 4000);
      },
    });
  });

  var output = "";

  $.ajax({
    type: "GET",
    url: "/api/products",
    success: (data) => {
      document.getElementById("amount").textContent = `${data.length}`;

      data.forEach((item) => {
        var sub = "";
        if (item.subCategories.length === 1) {
          sub += item.subCategories[0];
        } else if (item.subCategories.length === 0) {
          sub += "None";
        } else {
          item.subCategories.forEach((subCategory) =>
            item.subCategories.indexOf(subCategory) ===
            item.subCategories.length - 1
              ? (sub += "")
              : (sub += subCategory + ",")
          );
          sub += item.subCategories[item.subCategories.length - 1];
        }

        output += `
           <div class="item p-2 bg-primary  text-dark">
           <h4>${item.name}</h4>
           <ul>
           <li><span class="font-weight-bolder">Category:</span> ${item.category}</li>
           <li><span class="font-weight-bolder">Image URL:</span> ${item.image}</li>
           <li><span class="font-weight-bolder">Sub categories:</span> ${sub}.</li>
           <li><span class="font-weight-bolder">Description:</span> ${item.desc}</li>
           <li><span class="font-weight-bolder">Stock Count:</span> ${item.stockCount}</li>
           <li><span class="font-weight-bolder">Price:</span> ${item.price}</li> 
         </ul>
         </div>
         `;
      });

      $("#items").html(output);
    },
    error: (xhr) => {},
  });
});
