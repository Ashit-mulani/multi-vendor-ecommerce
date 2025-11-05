import Category from "@sakura-soft/common-category-model";

export async function getTree(categoryId) {
  const tree = await Category.find({
    parent: categoryId,
  }).select(" -__v");
  return tree;
}

export async function getAncestors(parent) {
  const ancestors = [];

  const visited = new Set();

  let currentId = parent;

  while (currentId) {
    if (visited.has(String(currentId))) {
      break;
    }

    const category = await Category.findById(currentId).select(" -__v");

    visited.add(String(currentId));

    if (!category) break;

    ancestors.push(category);

    currentId = category.parent;
  }

  return ancestors.reverse();
}
