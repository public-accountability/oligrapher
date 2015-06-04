const _ = require('lodash');

const that = {};

that.deselectAll = (menu) => menu.map(col =>  collapse(col));

that.selectColumn = (menu, fullMenu, clicked) => {

  const clickedCol = getColByHeader(menu, clicked);
  if (clickedCol.selected) return that.deselectAll(menu);

  else {
    const colToShow = getColByHeader(fullMenu, clicked);
    const colToHide = getSelectedCol(menu);
    const menu_ = colToHide ? collapseOne(menu, colToHide) : menu;
    return expandOne(menu_, colToShow);
  }
};

const collapseOne = (menu, colToHide) =>
  _.map(menu, col =>
    col.header === colToHide.header ? collapse(col) : col);

const expandOne = (menu, colToShow) =>
   _.map(menu, col =>
     col.header === colToShow.header ? expand(col, colToShow.cells) : col);

const getColByHeader = (menu, header) => _.findWhere(menu, { header: header });
const getSelectedCol = (menu) => _.findWhere(menu, { selected: true });
const alterCol = (col, change) => _.assign({}, col, change);

const expand = (col, cells) => select(showCells(col, cells));
const collapse = (col) => deselect(hideCells(col));

const showCells = (col, cells) => alterCol(col, {cells: cells });
const select = (col) => alterCol(col, { selected: true });
const hideCells = (col) => alterCol(col, { cells: [] });
const deselect = (col) => alterCol(col, { selected: false });


module.exports = that;
