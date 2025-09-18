import React, { useState } from "react";

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
function TodoForm({ addTodo, onEmptySubmit }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Trim whitespace — we don't allow empty or whitespace-only tasks.
    if (!value.trim()) {
      // Let the parent handle the validation UI (modal, toast, etc.).
      if (typeof onEmptySubmit === "function") onEmptySubmit();
      return;
    }
    // Add and reset input
    addTodo(value);
    setValue("");
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
      <button className="btn btn-info ms-2">THÊM</button>
    </form>
  );
}

export default TodoForm;
