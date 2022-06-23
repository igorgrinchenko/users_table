window.addEventListener("DOMContentLoaded", () => {
  const row = document.getElementsByClassName("table-row");
  const deleteBtn = document.querySelector(".delete");

  let globalStore;

  (getUsers = async () => {
    try {
      $(".container").css("display", "none");
      $(".loader").css("display", "block");
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();
      globalStore = data;
      renderContent();
    } catch (err) {
      console.error(err);
    } finally {
      $(".container").css("display", "flex");
      $(".loader").css("display", "none");
      console.info("Success");
    }
  })();

  const renderContent = () => {
    setHeader();
    setContent(globalStore);
    setUserInfo(globalStore);
  };

  const setHeader = () => {
    const headers = ["name", "username", "email", "website"];

    $(".table-header").html(
      headers.map(
        (title) => `<div class="header__item">
                      <a id=${title} class="filter__link" href="#">${title}</a>
                    </div>`
      )
    );
  };

  const setContent = (globalStore) => {
    $(".table-content").html(
      globalStore.map((userStore, index) => {
        const { name, username, email, website } = userStore;

        return `<div id=${index} class="table-row">
                  <div class="table-data">${name.toLowerCase()}</div>
                  <div class="table-data">${username.toLowerCase()}</div>
                  <div class="table-data">${email.toLowerCase()}</div>
                  <div class="table-data">${website.toLowerCase()}</div>
                  <i class="disabled fa-solid fa-pen" title="You can't edit this user"></i>
                  <input class="checkbox" type="checkbox" />
                </div>`;
      })
    );
    checkCheckedUsers();
    disabledEditBtnHandler();
  };

  const setUserInfo = (globalStore) => {
    const userInfoStore = [...row];

    userInfoStore.forEach((user, index) => {
      const { city, street, zipcode, suite } = globalStore[index].address;
      $(user).click((e) => {
        if (
          !e.target.classList.contains("checkbox") &&
          !e.target.classList.contains("disabled")
        ) {
          $(".overlay").fadeIn();
          document.body.style.overflow = "hidden";
          $(".popup_content")
            .html(`<h2 class="popup__h2">${globalStore[index].name}</h2>
                   <div class="user_info">
                      <span>City: ${city}</span>
                      <span>Street: ${street}</span>
                      <span>Zip: ${zipcode}</span>
                      <span>Suite: ${suite}</span>
                    </div>`);
        }
      });
    });
    closePopup();
  };

  const addUser = () => {
    $(".overlay").fadeIn();
    document.body.style.overflow = "hidden";
    let name = "";
    let username = "";
    let email = "";
    let website = "";
    $(".popup_content").html(`<h2 class="popup__h2">Add new user</h2>
                              <form action="" class="user_info">
                                <input id="new_name" type="text" placeholder="Name" />
                                <input id="new_username" type="text" placeholder="Username" />
                                <input id="new_email" type="text" placeholder="Email" />
                                <input id="new_website" type="text" placeholder="Website" />
                              </form>
                              <button type="button" class="btn btn-dark confirm">Confirm</button>`);

    $(".confirm").click(() => {
      name = document.querySelector("#new_name").value.toLowerCase();
      username = document.querySelector("#new_username").value.toLowerCase();
      email = document.querySelector("#new_email").value.toLowerCase();
      website = document.querySelector("#new_website").value.toLowerCase();
      id = globalStore.length + 1;

      if (name !== "" && username !== "" && email !== "" && website !== "") {
        globalStore.push({ id, name, username, email, website });
        const addedUser = document.createElement("div");
        addedUser.setAttribute("id", id);
        addedUser.setAttribute("class", "table-row added_user");
        addedUser.innerHTML = `<div class="table-data">${name}</div>
                               <div class="table-data">${username}</div>
                               <div class="table-data">${email}</div>
                               <div class="table-data">${website}</div>
                               <i class="edit fa-solid fa-pen"></i>
                               <input class="checkbox" type="checkbox" />`;
        document.querySelector(".table-content").appendChild(addedUser);
        $(".edit").click((e) => editUser(e));
        $(".overlay").fadeOut();
        checkCheckedUsers();
        document.body.style.overflow = "visible";
      } else {
        alert("Some fields are empty");
      }

      $(".added_user").click((e) => {
        if (
          !e.target.classList.contains("checkbox") &&
          !e.target.classList.contains("edit")
        ) {
          $(".overlay").fadeIn();
          document.body.style.overflow = "hidden";
          $(".popup_content").html(`<h2 class="popup__h2">User info</h2>
                                    <span>No additional info about this user</span>`);
        }
      });
    });
  };

  const deleteUser = () => {
    const checkedUsers = [...document.getElementsByClassName("checkbox")];
    checkedUsers.forEach((item) => {
      if (item.checked) {
        $(".overlay").fadeIn();
        document.body.style.overflow = "hidden";
        $(".popup_content").html(`<h2 class="popup__h2">Warning!</h2>
                                  <span>Are you sure?</span>
                                  <button type="button" class="btn btn-dark yes_btn">Yes!</button>`);

        document.querySelector(".yes_btn").addEventListener("click", () => {
          checkedUsers.forEach((item) => {
            if (item.checked) {
              item.parentElement.remove();
              $(".overlay").fadeOut();
              document.body.style.overflow = "visible";
              deleteBtn.setAttribute("disabled", true);
            }
          });
        });
      }
    });
  };

  const editUser = (e) => {
    let name = "";
    let username = "";
    let email = "";
    let website = "";
    $(".overlay").fadeIn();
    document.body.style.overflow = "hidden";
    $(".popup_content").html(`<h2 class="popup__h2">Edit user</h2>
                      <form action="" class="user_info">
                        <input id="edited_name" type="text" placeholder="Name" />
                        <input id="edited_username" type="text" placeholder="Username" />
                        <input id="edited_email" type="text" placeholder="Email" />
                        <input id="edited_website" type="text" placeholder="Website" />
                      </form>
                      <button type="button" class="btn btn-dark edit_btn">Edit</button>
                      `);

    $(".edit_btn").click(() => {
      name = document.querySelector("#edited_name").value.toLowerCase();
      username = document.querySelector("#edited_username").value.toLowerCase();
      email = document.querySelector("#edited_email").value.toLowerCase();
      website = document.querySelector("#edited_website").value.toLowerCase();
      id = globalStore.length + 1;

      if (name !== "" && username !== "" && email !== "" && website !== "") {
        e.target.parentElement.innerHTML = `<div class="table-data">${name}</div>
                                            <div class="table-data">${username}</div>
                                            <div class="table-data">${email}</div>
                                            <div class="table-data">${website}</div>
                                            <i class="edit fa-solid fa-pen"></i>
                                            <input class="checkbox" type="checkbox" />
                                            `;

        $(".edit").click((e) => editUser(e));
        $(".overlay").fadeOut();
        checkCheckedUsers();
        document.body.style.overflow = "visible";
      } else {
        alert("Some fields are empty");
      }
    });
  };

  $(".add").click(addUser);
  $(".delete").click(deleteUser);

  const checkCheckedUsers = () => {
    const checkedUsers = [...document.getElementsByClassName("checkbox")];
    for (let i = 0; i < checkedUsers.length; i++) {
      checkedUsers[i].addEventListener("click", () => {
        for (let i = 0; i < checkedUsers.length; i++) {
          if (checkedUsers[i].checked) {
            deleteBtn.removeAttribute("disabled");
            break;
          } else {
            deleteBtn.setAttribute("disabled", true);
          }
        }
      });
    }
  };

  const disabledEditBtnHandler = () => {
    $(".disabled").click(() => {
      $(".overlay").fadeIn();
      document.body.style.overflow = "hidden";
      $(".popup_content").html(`<h2 class="popup__h2">Oops...</h2>
                                <div class="user_info">
                                  <span>Sorry, but you can edit only added users</span>
                                </div>`);
    });
  };

  const closePopup = () => {
    $(".close-popup").click(() => {
      $(".overlay").fadeOut();
      document.body.style.overflow = "visible";
    });

    $(document).mouseup((e) => {
      const popup = $(".popup");
      if (e.target != popup[0] && popup.has(e.target).length === 0) {
        $(".overlay").fadeOut();
        document.body.style.overflow = "visible";
      }
    });
  };
});
