function autocomplete_timecodes(inp, arr, arr_2) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    // console.log('Input', inp)
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          var bill_code_category = arr_2.map( function(item){ return item.bill_code_category })
          var bill_code_category_name = arr_2.map( function(item){ return item.bill_code_category_name })
          var bill_code = arr_2.map( function(item){ return item.bill_code })
          var bill_code_name = arr_2.map( function(item){ return item.bill_code_name })
          var bill_code_definition = arr_2.map( function(item){ return item.bill_code_definition })
          
          
          /*check if the item starts with the same letters as the text field value:*/
          if (bill_code_category[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || bill_code_category_name[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || bill_code[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || bill_code_name[i].substr(0, val.length).toUpperCase() == val.toUpperCase())  {
            if (arr_2.map( function(item) { return item.bill_code_category })[i] == null){
                bill_code_category[i] = ''
            }
            if (arr_2.map( function(item) { return item.bill_code_category_name })[i] == null){
                bill_code_category_name[i] = ''
            }
            if (arr_2.map( function(item) { return item.bill_code })[i] == null){
                bill_code[i] = ''
            }
            if (arr_2.map( function(item) { return item.bill_code_name })[i] == null){
                bill_code_name[i] = ''
            }
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");

            b.setAttribute("class", "autocomplete-subitems");
            /*make the matching letters bold:*/
            // b.innerHTML = "<strong>" + arr_2[i].substr(0, val.length) + "</strong>";
            if (bill_code_category[i] != "") {
              b.innerHTML += bill_code_category[i]
              b.innerHTML += ', '
            }
            
            if (bill_code_category_name[i] != "") {
              b.innerHTML +=  bill_code_category_name[i];
            b.innerHTML += ', '
            }
            
            if (bill_code[i] != "") {
              b.innerHTML +=  bill_code[i];
            b.innerHTML += ', '
            }
           
            if (bill_code_name[i] != "") {
              b.innerHTML +=  bill_code_name[i];
            }

            // b.innerHTML += arr_2[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + bill_code_category[i] +"$" + bill_code_category_name[i]+"$" + bill_code[i]+"$" + bill_code_name[i]+"$" + bill_code_definition[i]+ "'>";
            
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                input_array = inp.value.split('$')
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
                //  Add values in inputs
                
                $(inp).parents('form').find('input[name="bill_code_category"]').val(input_array[0])
                $(inp).parents('form').find('input[name="bill_code_category_name"]').val(input_array[1])
                $(inp).parents('form').find('input[name="bill_code"]').val(input_array[2])
                $(inp).parents('form').find('input[name="bill_code_name"]').val(input_array[3])
                $(inp).parents('form').find('textarea[name="bill_code_definition"]').val(input_array[4])
                
                inp.value = "";
               
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }
//   var keywords = ["Sevan Podcast","Coffee Pods and Wods","Clydesdale Media","Training Think Tank","Misfit Athletics"];
    
//               /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
             
// autocomplete(document.getElementById("myInput"), keywords);
function search_filter_timecodes(this_element){
    // console.log('Search filter function')
    var $this = $(this_element);
    $.ajax({ 
          method: "GET",
          url: `/30/search_filter_timecodes/`,
        
          success:function(response){            
            autocomplete_timecodes(this_element, response.data, response.data );
            // console.log('Search filter function',response.data)
          },
          error:function(){
              console.log('search url is not working')
          }
        });
};
