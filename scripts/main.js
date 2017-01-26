var sortAnimation = (function () {
  'use strict';

  var numberList = [];

  var numberField = $('#input-number');
  var addButton = $('#input-add');
  var removeButton = $('#input-remove');
  var sortButton = $('#input-sort');
  var numberListElem = $('#div-number-list');

  var miliSecondsDelay = 1000;

  /**
   * List Operations
   */

  function addNumber(number) {
    var index = numberList.indexOf(number);
    if (index === -1) {
      numberList.push(number);
      displayNumberList();
      numberField.val('');
    } else {
      alert('Agrege un número que no haya sido agregado anteriormente.');
    }
  }

  function removeLastNumber() {
    numberList.pop();
    displayNumberList();
  }

  /**
   * Displaying Functions
   */

  function listToStr(list) {
    var strList = list.toString();
    strList = strList.replace(/,/g, ' ');
    return strList;
  }

  function displayNumberList() {
    var strList = listToStr(numberList);
    numberListElem.html(strList);
  }

  function displayNumberListWithDelay(last) {
    var temporalNumberList = numberList.slice();
    numberListElem.animate({right: '0%'}, miliSecondsDelay, function (list) {
      return function () {
        disableButtons();
        numberListElem
          .hide()
          .html(listToStr(list))
          .show();
        if (last) {
          ableButtons();
        }
      };
    }(temporalNumberList));
  }

  /**
   * Button Status Functions
   */

  function disableButtons() {
    addButton.prop('disabled', true);
    removeButton.prop('disabled', true);
    sortButton.prop('disabled', true);
  }

  function ableButtons() {
    addButton.prop('disabled', false);
    removeButton.prop('disabled', false);
    sortButton.prop('disabled', false);
  }

  /**
   * Sorting Algorithm:
   * I use the Quicksort sorting algorithm with the Lomuto's partition
   * algorithm, the pivot element is by default the last element.
   * This algorithm take O(n log n) in most cases.
   */

  function sortNumberList() {
    disableButtons();
    var size = numberList.length;
    var start = 0;
    var end = size - 1;
    quickSort(numberList, start, end);
    displayNumberListWithDelay(true);
  }

  function quickSort(numList, start, end) {
    if (start < end) {
      var pivot = partition(numList, start, end);
      quickSort(numList, start, pivot - 1);
      quickSort(numList, pivot + 1, end);
    }
  }

  function partition(numList, start, end) {
    var pivot = numList[end];
    var i = start - 1;
    for (var j = start; j < end; j++) {
      if (numList[j] <= pivot) {
        i += 1;
        exchange(numList, i, j);
      }
    }
    var partitionIndex = i + 1;
    exchange(numList, partitionIndex, end);
    return partitionIndex;
  }

  function exchange(numList, i, j) {
    var temp = numList[i];
    numList[i] = numList[j];
    numList[j] = temp;
    if (i !== j) {
      displayNumberListWithDelay();
    }
  }

  /**
   * Field Validations
   */

  function validateNumberField() {
    var numberValue = numberField.val();
    if (Number.isNaN(numberValue) || numberValue === '' || numberValue === ' ') {
      alert('Agregue un número valido por favor.');
      return false;
    } else {
      numberValue = Number(numberValue);
      if (Number.isInteger(numberValue)) {
        return true;
      } else {
        alert('Agregue un número valido por favor.');
        return false;
      }
    }
  }

  /**
   * Event Association Functions
   */

  function associateAddEvent() {
    addButton.on('click', function () {
      if (validateNumberField()) {
        var numberValue = numberField.val();
        numberValue = Number(numberValue);
        addNumber(numberValue);
      }
    });
  }

  function associateRemoveEvent() {
    removeButton.on('click', removeLastNumber);
  }

  function associateSortEvent() {
    sortButton.on('click', sortNumberList);
  }

  /**
   * Initialization function
   */

  function begin() {
    numberList.push(5);
    numberList.push(3);
    numberList.push(7);
    numberList.push(1);
    numberList.push(8);
    numberList.push(2);
    numberList.push(6);
    numberList.push(4);
    displayNumberList();
  }

  return {
    begin: begin,
    associateAddEvent: associateAddEvent,
    associateRemoveEvent: associateRemoveEvent,
    associateSortEvent: associateSortEvent
  };
}());

$(document).ready(function () {
  sortAnimation.associateAddEvent();
  sortAnimation.associateRemoveEvent();
  sortAnimation.associateSortEvent();
  sortAnimation.begin();
});
