const table = document.querySelector('#example')
const cellsContainer = document.querySelector('.cells-container'); //tbody
const allTd = document.querySelectorAll('.cells-container td'); //tbody td
const allTr = document.querySelectorAll('.cells-container tr'); //tbody tr

let isMouseDown = false;
let startRowIndex = null;
let startCellIndex = null;






function index(el) {
    if (!el) return -1;
    var i = 0;
    do {
        i++;
    } while (el = el.previousElementSibling);
    return i;
}

function selectTo(cell) {
    let row = cell.parentElement;
    console.log('row', row)

    let cellIndex = index(cell) - 1;
    let rowIndex = index(row) - 1;

    let rowStart, rowEnd, cellStart, cellEnd;

    if (rowIndex < startRowIndex) {
        rowStart = rowIndex;
        rowEnd = startRowIndex;
    } else {
        rowStart = startRowIndex;
        rowEnd = rowIndex;
    }

    if (cellIndex < startCellIndex) {
        cellStart = cellIndex;
        cellEnd = startCellIndex;
    } else {
        cellStart = startCellIndex;
        cellEnd = cellIndex;
    }

    const cellObj = {
        rowStart: rowStart,
        rowEnd: rowEnd,
        cellStart: cellStart,
        cellEnd: cellEnd
    }
    console.log('cellObj', cellObj);

    for (var i = rowStart; i <= rowEnd; i++) {


        //td's inside selected rows 
        var rowCells = allTr[i].children;
        console.log('selected row td', rowCells);

        for (var j = cellStart; j <= cellEnd; j++) {
            rowCells[j].classList.add('selected');
        }
    }
    console.log('All rows that selected', rowCells)

}

const getCurrrentPosition = () => {
    return cellPosition = { cellIndex: startCellIndex, rowIndex: startRowIndex }
}

const isPositionInsideTable = (position) => {
    rowCount = allTr.length - 1;
    cellCount = allTr[0].children.length - 1;

    console.log('rowCount', rowCount);
    console.log('cellCount', cellCount);

    // Return false if positon outside of the table
    if (
        position.cellIndex < 0 ||
        position.rowIndex < 0 ||
        position.cellIndex > cellCount ||
        position.rowIndex > rowCount
    ) {
        return false;
    } else {
        return true;
    }
}

const selectCell = (position) => {

    //td's inside selected rows 
    var rowCells = allTr[position.rowIndex].children;
    rowCells[position.cellIndex].classList.add('selected');
    startRowIndex = position.rowIndex
    startCellIndex = position.cellIndex
}

const removeSelected = () => {
    const selectedCells = document.querySelectorAll('.selected');
    selectedCells.forEach(selectedCell => {
        selectedCell.classList.remove('selected');
    })
    console.log('all selected cells removed');
}

//it fires "double click"
cellsContainer.addEventListener('dblclick', e => {
    const target = e.target;

    console.log('e', e);
    console.log('target', target);

    // if the cliked item is Td
    if (target.nodeName == 'TD') {

        if (target.hasAttribute('data-clicked')) return;

        //set td element value to data value
        target.setAttribute('data-clicked', 'yes');
        target.setAttribute('data-text', target.innerHTML);

        //create new input element
        var input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.value = target.innerHTML
        input.style.width = target.offsetWidth - (target.clientLeft * 2) + 'px'
        input.style.height = target.offsetHeight - (target.clientTop * 2) + 'px'
        input.style.border = '0px'
        input.style.fontFamily = 'inherit'
        input.style.fontSize = 'inherit'
        input.style.textAlign = 'inherit'
        input.style.backgroundColor = 'LightGoldenRedYellow'


        input.onblur = function () {
            console.log('onblur worked')
            var td = input.parentElement;
            var orig_text = input.parentElement.getAttribute('data-text');
            console.log('target.value', input.value);
            var current_text = this.value;

            if (orig_text != current_text) {
                //there is some changes
                //save to db
                td.removeAttribute('data-clicked');
                td.removeAttribute('data-text');
                td.innerHTML = current_text;
                td.style.cssText = 'padding: 5px';
                console.log(`${orig_text} changed to ${current_text}`);
            } else {
                td.removeAttribute('data-clicked');
                td.removeAttribute('data-text');
                td.innerHTML = orig_text;
                td.style.cssText = 'padding: 5px';
                console.log(`No Changes Made`);
            }
        }
        input.addEventListener("keydown", e => {
            console.log('keycode e', e);
            console.log(e.code)

            if (e.code == 'Enter') {
                e.stopPropagation();
                console.log('enter cliked')
                console.log('target', target)
                input.blur()
            }
        })
        input.onkeypress = function () {

        }
        console.log(input)

        target.innerHTML = ''
        target.style.cssText = 'padding: 0px 0px'
        target.append(input)
        target.firstElementChild.select()

    }
})
document.body.addEventListener('keydown', e => {
    const selectedCells = document.querySelectorAll('.selected');
    if (selectedCells.length == 1) {

        //get cliked last clicked cell's current position
        currentPosition = getCurrrentPosition();

        switch (e.code) {
            case ('Enter'):
                //create double clik event
                var event = new MouseEvent('dblclick', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                selectedCells[0].dispatchEvent(event);
                break;
            case ('ArrowUp'):
                currentPosition.rowIndex = currentPosition.rowIndex - 1
                console.log(isPositionInsideTable(currentPosition));
                if (isPositionInsideTable(currentPosition)) {
                    removeSelected();
                    selectCell(currentPosition)
                    console.log('current position', currentPosition);
                }
                break;
            case ('ArrowDown'):
                currentPosition.rowIndex = currentPosition.rowIndex + 1;

                if (isPositionInsideTable(currentPosition)) {
                    removeSelected();
                    selectCell(currentPosition)
                    console.log('current position', currentPosition);
                }
                break;
            case ('ArrowRight'):
                currentPosition.cellIndex = currentPosition.cellIndex + 1

                if (isPositionInsideTable(currentPosition)) {
                    removeSelected();
                    selectCell(currentPosition)
                    console.log('current position', currentPosition);
                }
                break;
            case ('ArrowLeft'):
                currentPosition.cellIndex = currentPosition.cellIndex - 1

                if (isPositionInsideTable(currentPosition)) {
                    removeSelected();
                    selectCell(currentPosition)
                    console.log('current position', currentPosition);

                }
                break;

        }

    } else if (selectedCells.length == 0) {
        console.log('no cell selected, quick go back');
    }

})
cellsContainer.addEventListener('mousedown', e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.nodeName == 'TD') {
        // console.warn('mousedown event fired for TD element')

        isMouseDown = true;
        var cell = e.target;

        console.log('cell', cell);

        removeSelected(); //deselect everything

        if (e.shiftKey) {
            // console.log('shifte tıklandı');
            selectTo(cell);
        } else {
            // console.log('shifte tıklanılmadı');
            cell.classList.add('selected')

            startCellIndex = index(cell) - 1;
            startRowIndex = index(cell.parentElement) - 1;
        }
        return false; // prevent text selection

    }
})
cellsContainer.addEventListener('mouseover', e => {
    // console.log('mouseover evet fired, isMouseDown', isMouseDown);

    if (!isMouseDown) return;
    allTd.forEach(td => {
        td.classList.remove('selected') // deselect everything
        console.log('remove worked')
    })
    selectTo(e.target);
})

document.addEventListener('mouseup', () => {
    isMouseDown = false;
});




