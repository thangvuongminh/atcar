import React, { useEffect } from "react";
import { useEditorCategoriesStore } from "../../store/editor.categories.store";

const CategoriesEditor = () => {
  const categories = useEditorCategoriesStore((s) => s.categories);
  const name = useEditorCategoriesStore((s) => s.name);

  const setName = useEditorCategoriesStore((s) => s.setName);
  const fetchCategories = useEditorCategoriesStore((s) => s.fetchCategories);
  const addCategory = useEditorCategoriesStore((s) => s.addCategory);
  const deleteCategory = useEditorCategoriesStore((s) => s.deleteCategory);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý danh mục</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addCategory();
        }}
        className="mb-6 flex gap-2"
      >
        <input
          type="text"
          placeholder="Tên danh mục"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 rounded flex-1"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Thêm</button>
      </form>

      <ul className="bg-white rounded shadow divide-y">
        {categories.map((c) => (
          <li key={c._id} className="flex justify-between p-3">
            {c.name}
            <button onClick={() => deleteCategory(c._id)} className="text-red-600">
              Xoá
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesEditor;
