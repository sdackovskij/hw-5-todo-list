var todoModule = (function() {
  var now = new Date();
  Current_day.innerHTML = now.toDateString();
  sub.onclick = addTask;
  clear.onclick = clearList;

  function Item() {
    this.task = "";
    this.date = Date;
    this.done = false;
  }

  var MillisecondsInDay = 86400000;
  var MillisecondsInWeek = 604800000;

  document.addEventListener("DOMContentLoaded", function() {
    var returnObj = JSON.parse(localStorage.getItem("myKey"));

    if (returnObj) {
      returnObj.forEach(function(item) {
        showList(item);
      });
    }
  });

  function addTask() {
    if (document.getElementById("nameTask").value != "") {
      var item = new Item();
      item.task = document.getElementById("nameTask").value;
      item.date = document.getElementById("date").value;
      document.getElementById("nameTask").value = "";
      document.getElementById("date").value = null;

      showList(item);
    }
    storage();
  }

  function showList(item) {
    checkIs = "";
    if (item.done == true) {
      checkIs = "checked";
    } else {
      checkIs = "";
    }
    list.insertAdjacentHTML(
      "beforeend",
      "<li class='one'><input class='done'" +
        checkIs +
        " type='checkbox' value='done'><span class='tasks'>" +
        item.task +
        "</span><span class='date'>" +
        item.date +
        "</span><input type='button' value='delete' class='remove'></li>"
    );
    if (item.done) {
      list.lastChild.firstChild.nextSibling.classList.add("doneTask");
    }
  }

  list.addEventListener("click", function(event) {
    if (event.target.value == "delete") {
      removeTest(event.target);
    }

    if (event.target.value == "done") {
      checkedTest(event.target);
    }

    storage();
  });

  function storage() {
    var obj = toArray();
    var serialObj = JSON.stringify(obj);
    localStorage.setItem("myKey", serialObj);
  }

  function removeTest(elem) {
    list.removeChild(elem.parentNode);
  }

  function checkedTest(elem) {
    elem.nextSibling.classList.toggle("doneTask");
  }

  DoneFilter.addEventListener("change", function(event) {
    var arrForFilter = toArray();

    for (var i = 0; i < arrForFilter.length; i++) {
      list.children[i].removeAttribute("hidden", "true");

      if (event.target.value == "AllDone" && arrForFilter[i].done == false) {
        list.children[i].setAttribute("hidden", "true");
      }

      if (event.target.value == "AllUndone" && arrForFilter[i].done == true) {
        list.children[i].setAttribute("hidden", "true");
      }
    }
  });

  DateFilter.addEventListener("change", function(event) {
    var arrForFilter = toArray();

    for (var i = 0; i < arrForFilter.length; i++) {
      var taskDeadline = new Date(arrForFilter[i].date);
      var now = new Date();
      taskDeadline.setHours(0, 0, 0);
      now.setHours(0, 0, 0);
      var deadlineIsTomorrow = now.getTime() + MillisecondsInDay;
      var deadlineIsThisWeek = now.getTime() + MillisecondsInWeek;
      var dtTomorrow = new Date(deadlineIsTomorrow);
      var dtWeek = new Date(deadlineIsThisWeek);

      list.children[i].removeAttribute("hidden", "true");

      if (event.target.value == "Tomorrow")
        if (
          taskDeadline < now ||
          taskDeadline > dtTomorrow ||
          taskDeadline == "Invalid Date"
        ) {
          list.children[i].setAttribute("hidden", "true");
        }

      if (event.target.value == "Week")
        if (
          taskDeadline < now ||
          taskDeadline > dtWeek ||
          taskDeadline == "Invalid Date"
        ) {
          list.children[i].setAttribute("hidden", "true");
        }
    }
  });

  function clearList() {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    localStorage.clear();
  }

  function toArray() {
    var arrNamesTasks = list.querySelectorAll(".tasks");
    var arrDates = list.querySelectorAll(".date");
    var arrDone = list.querySelectorAll(".done");
    var arrList = [];
    for (var i = 0; i < arrNamesTasks.length; i++) {
      var item = new Item();
      item.task = arrNamesTasks[i].innerHTML;
      item.date = arrDates[i].innerHTML;
      item.done = arrDone[i].checked;
      arrList.push(item);
    }
    return arrList;
  }
})();
