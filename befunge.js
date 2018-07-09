const move = (pos, dir) => {
  let x, y;
  switch (dir) {
    case 0:
      y = (pos[0] - 1) % 25;
      x = pos[1];
      break;
    case 1:
      y = pos[0];
      x = (pos[1] + 1) % 80;
      break;
    case 2:
      y = (pos[0] + 1) % 25;
      x = pos[1];
      break;
    case 3:
      y = pos[0];
      x = (pos[1] - 1) % 80;
      break;
  }
  return [y, x];
};

const matrix = (w, h, val) =>
  range(h).map(v => range(w).map(v => val));

const range = (n, val) =>
  Array(n).fill(val);

const interpret = input => {
  let m = matrix(80, 25, ' ');
  input = input.split('\n');

  const maxLen = Math.max(...input.map(v => v.length));
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < maxLen; j++) {
      if (i < input.length && j < input[i].length) {
        m[i][j] = input[i][j];
      }
    }
  }
  input = m;
  let a, b, v;
  let dir = 1;
  let stack = [];
  let pos = [0, 0];
  let currentVal;
  let stringMode = false;
  let output = '';
  while (input[pos[0]][pos[1]] !== '@') {

    currentVal = input[pos[0]][pos[1]];

    if (stringMode && currentVal !== '"') {
      stack.push(currentVal.charCodeAt(0));
      pos = move(pos, dir);
      continue;
    }

    if (!isNaN(parseInt(currentVal))) {
      stack.push(parseInt(currentVal));
      pos = move(pos, dir);
      continue;
    }

    switch (currentVal) {
      case ' ':
        break;
      case '+':
        if (stack.length > 1) {
          stack.push(stack.pop() + stack.pop());
        }
        break;
      case '-':
        if (stack.length > 1) {
          a = stack.pop();
          stack.push(stack.pop() - a);
        }
        break;
      case '*':
        stack.push(stack.pop() * stack.pop());
        break;
      case '/':
        a = stack.pop();
        if (a === 0) {
          stack.push(stack.pop() * 0);
        }
        stack.push(Math.floor(stack.pop() / a));
        break;
      case '%':
        a = stack.pop();
        if (a === 0) {
          stack.push(stack.pop() * 0);
        }
        stack.push(stack.pop() % a);
        break;
      case '!':
        if (stack.pop() === 0) {
          stack.push(1);
        } else {
          stack.push(0);
        }
        break;
      case '`':
        if (stack.pop() < stack.pop()) {
          stack.push(1);
        } else {
          stack.push(0);
        }
        break;
      case '>':
        dir = 1;
        break;
      case '<':
        dir = 3;
        break;
      case '^':
        dir = 0;
        break;
      case 'v':
        dir = 2;
        break;
      case '?':
        dir = Math.floor(Math.random() * 4);
        break;
      case '_':
        if (stack.length === 0 || stack.pop() === 0) {
          dir = 1;
        } else {
          dir = 3;
        }
        break;
      case '|':
        if (stack.length === 0 || stack.pop() === 0) {
          dir = 2;
        } else {
          dir = 0;
        }
        break;
      case '"':
        stringMode = !stringMode;
        break;
      case ':':
        if (stack.length > 0) {
          stack.push(stack[stack.length - 1]);
        } else {
          stack.push(0);
        }
        break;
      case '\\':
        if (stack.length > 1) {
          a = stack.pop();
          b = stack.pop();
          stack.push(a);
          stack.push(b);
        } else {
          stack.push(0);
        }
        break;
      case '$':
        stack.pop();
        break;
      case '.':
        output += stack.pop();
        break;
      case ',':
        output += String.fromCharCode(stack.pop());
        break;
      case '#':
        pos = move(pos, dir);
        break;
      case 'p':
        b = stack.pop();
        a = stack.pop();
        v = stack.pop();
        input[b][a] = String.fromCharCode(v);
        break;
      case 'g':
        b = stack.pop();
        a = stack.pop();
        stack.push(input[b][a].charCodeAt(0));
        break;
    }
    pos = move(pos, dir);
  }
  return output;
};

/*
>987v>.v
v456<  :
>321 ^ _@
*/
let input = ">987v>.v\nv456<  :\n>321 ^ _@";
/*
08>:1-:v v *_$.@
  ^    _$>\:^
*/
input = `08>:1-:v v *_$.@\n  ^    _$>\\:^`;
input = `01->1# +# :# 0# g# ,# :# 5# 8# *# 4# +# -# _@`;
console.log(interpret(input));