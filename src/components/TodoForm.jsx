import React, { useState, useEffect } from "react";

/*
  TodoForm

  Props:
    - addTodo(text: string): function
        Gọi khi người dùng submit một todo hợp lệ (không rỗng). Component
        cha (App) chịu trách nhiệm thêm todo vào state.

    - onEmptySubmit(): function (optional)
        Callback tuỳ chọn được gọi khi người dùng cố submit một todo
        rỗng (hoặc chỉ chứa khoảng trắng). Parent có thể dùng để hiển thị
        cảnh báo (ví dụ modal).

  State cục bộ:
    - value: string - giá trị được điều khiển của input todo

  Hành vi:
    - Ngăn hành vi submit mặc định của form
    - Nếu value trim là rỗng thì gọi `onEmptySubmit` (nếu có) và không gọi `addTodo`
    - Ngược lại, gọi `addTodo` và xoá input
*/
function TodoForm({ addTodo, onEmptySubmit, editingTodo, updateTodo, cancelEdit }) {
  const [value, setValue] = useState("");

  // When `editingTodo` changes, populate the input with its text.
  useEffect(() => {
    if (editingTodo && editingTodo.text) {
      setValue(editingTodo.text);
    } else {
      setValue("");
    }
  }, [editingTodo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Trim whitespace — we don't allow empty or whitespace-only tasks.
    if (!value.trim()) {
      if (typeof onEmptySubmit === "function") onEmptySubmit("Tên công việc không được phép để trống.");
      return;
    }
    if (editingTodo && typeof updateTodo === "function") {
      updateTodo(editingTodo.id, value);
    } else {
      addTodo(value);
    }
    // Reset local input only if not editing (parent will clear editingTodo)
    if (!editingTodo) setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex justify-content-center align-items-center mb-4">
      <div className="form-floating flex-grow-1 me-2">
        <input
          type="text"
          className="form-control"
          id="todo-input"
          placeholder="Nhập tên công việc"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <label htmlFor="todo-input">Nhập tên công việc</label>
      </div>
      <div className="d-flex align-items-center">
        <button className="btn btn-info ms-2" type="submit">
          {editingTodo ? "CẬP NHẬT" : "THÊM"}
        </button>
        {editingTodo ? (
          <button type="button" className="btn btn-secondary ms-2" onClick={() => typeof cancelEdit === "function" ? cancelEdit() : null}>
            HỦY
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default TodoForm;
