var submit = document.getElementById("submit");

submit.addEventListener("click", () => {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let adminUsername = document.getElementById("adminUsername").value;
  let adminPassword = document.getElementById("adminPassword").value;

  var url = `/api/admins/?userName=${username}&password=${password}&newAdmin=${adminUsername}&adminPassword=${adminPassword}`;
  $.ajax({
    type: "POST",
    url: url,
    success: (data) => {
      console.log(data);
    },
  });
});
