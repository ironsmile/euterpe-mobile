export const constrainedRecencyBuffer = (buffer, item, maxSize) => {
  let newBuffer = [];
  const index = buffer.indexOf(item);

  if (index === -1) {
    newBuffer = [item, ...buffer];
  } else {
    newBuffer = [item, ...buffer.slice(0, index), ...buffer.slice(index + 1)];
  }

  if (newBuffer.length > maxSize) {
    newBuffer = newBuffer.slice(0, maxSize);
  }

  return newBuffer;
};
