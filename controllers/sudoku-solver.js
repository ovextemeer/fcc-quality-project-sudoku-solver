class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return false;
    }

    for (let i = 0; i < 81; ++i) {
      const c = puzzleString.charAt(i);

      if ((c < '1' || c > '9') && c !== '.') {
        return undefined;
      }
    }

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const p2D = convertP2D(puzzleString);
    const rI = convertRI(row);

    if (p2D[rI][column - 1] === '.') {
      p2D[rI][column - 1] = value.toString();
    }

    return check9(p2D[rI]);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const p2D = convertP2D(puzzleString);
    const rI = convertRI(row);
    let cs = [];

    if (p2D[rI][column - 1] === '.') {
      p2D[rI][column - 1] = value.toString();
    }

    for (let rs of p2D) {
      cs.push(rs[column - 1]);
    }

    return check9(cs);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const p2D = convertP2D(puzzleString);
    const rIndex = convertRI(row);
    const rIs = calIs(convertRI(row));
    const cIs = calIs(column - 1);
    let regs = [];

    if (p2D[rIndex][column - 1] === '.') {
      p2D[rIndex][column - 1] = value.toString();
    }

    for (let rI of rIs) {
      for (let cI of cIs) {
        regs.push(p2D[rI][cI]);
      }
    }

    return check9(regs);
  }

  solve(puzzleString) {
    if (this.validate(puzzleString) === true) {
      let arr = [puzzleString.slice(0)];

      while (arr.length > 0 && arr[0].indexOf('.') !== -1) {
        let ar = [];

        for (let pS of arr) {
          const i = pS.indexOf('.');

          if (i !== -1) {
            for (let char of ['1', '2', '3', '4', '5', '6', '7', '8', '9']) {
              if (
                this.checkRowPlacement(pS, convertIR((i - (i % 9)) / 9), i % 9 + 1, char)
                &&
                this.checkColPlacement(pS, convertIR((i - (i % 9)) / 9), i % 9 + 1, char)
                &&
                this.checkRegionPlacement(pS, convertIR((i - (i % 9)) / 9), i % 9 + 1, char)
              ) {
                ar.push(pS.slice(0, i) + char + pS.slice(i + 1));
              }
            }

            if (pS.charAt(i) === '.') {
              ar.push(pS.slice(0, i) + 'x' + pS.slice(i + 1));
            }
          } else {
            ar.push(pS);
          }
        }

        arr = [];
        ar.forEach(pS => {
          if (pS.indexOf('x') === -1) {
            arr.push(pS);
          }
        });
      }

      return arr.length >= 1 ? arr[0] : false;
    }

    return false;
  }
}

function convertP2D(pS) {
  let rs = [];
  let cs = [];

  for (let i = 0; i < 81; ++i) {
    cs.push(pS.charAt(i));

    if ((i + 1) % 9 === 0) {
      rs.push(cs);
      cs = [];
    }
  }

  return rs;
}

function convertRI(row) {
  switch (row) {
    case 'A':
      return 0;
    case 'B':
      return 1;
    case 'C':
      return 2;
    case 'D':
      return 3;
    case 'E':
      return 4;
    case 'F':
      return 5;
    case 'G':
      return 6;
    case 'H':
      return 7;
    case 'I':
      return 8;
  }
}

function check9(arr) {
  const ar = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let c = 0;

  for (let e of ar) {
    for (let el of arr) {
      if (el === e) {
        ++c;

        if (c === 2) {
          return false;
        }
      }
    }

    c = 0;
  }

  return true;
}

function calIs(i) {
  switch (i % 3) {
    case 0:
      return [i, i + 1, i + 2];
    case 1:
      return [i - 1, i, i + 1];
    case 2:
      return [i - 2, i - 1, i];
  }
}

function convertIR(i) {
  switch (i) {
    case 0:
      return 'A';
    case 1:
      return 'B';
    case 2:
      return 'C';
    case 3:
      return 'D';
    case 4:
      return 'E';
    case 5:
      return 'F';
    case 6:
      return 'G';
    case 7:
      return 'H';
    case 8:
      return 'I';
  }
}

module.exports = SudokuSolver;

