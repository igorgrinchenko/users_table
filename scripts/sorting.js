window.addEventListener("DOMContentLoaded", () => {
  const headers = ["name", "username", "email", "website"];

  $.each(headers, function (i, val) {
    let orderClass = "";
    setTimeout(() => {
      $("#" + val).click(function (e) {
        e.preventDefault();
        $(".filter__link.filter__link--active")
          .not(this)
          .removeClass("filter__link--active");
        $(this).toggleClass("filter__link--active");
        $(".filter__link").removeClass("asc desc");

        if (orderClass == "desc" || orderClass == "") {
          $(this).addClass("asc");
          orderClass = "asc";
        } else {
          $(this).addClass("desc");
          orderClass = "desc";
        }

        let parent = $(this).closest(".header__item");
        let index = $(".header__item").index(parent);
        let $table = $(".table-content");
        let rows = $table.find(".table-row").get();
        let isSelected = $(this).hasClass("filter__link--active");

        rows.sort(function (a, b) {
          let x = $(a).find(".table-data").eq(index).text();
          let y = $(b).find(".table-data").eq(index).text();

          if (isSelected) {
            if (x < y) return -1;
            if (x > y) return 1;
            return 0;
          } else {
            if (x > y) return -1;
            if (x < y) return 1;
            return 0;
          }
        });

        $.each(rows, function (index, row) {
          $table.append(row);
        });

        return false;
      });
    }, 200);
  });
});
