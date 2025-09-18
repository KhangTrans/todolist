import React, { useState } from "react";

/*
  TodoItem

  Props:
    - todo: { id, text, completed }
      Dữ liệu cho item đang được render.

    - toggleTodo(id): function
      Gọi khi checkbox thay đổi trạng thái.

    - deleteTodo(id): function
      Hàm xóa trực tiếp (không dùng mặc định khi parent quản lý flow xác
      nhận bằng `requestDelete`). Vẫn giữ để đầy đủ.

    - editTodo(id, newText): function
      Gọi khi item hoàn tất chỉnh sửa inline để lưu text mới.

    - requestDelete(id): function
      Gọi khi người dùng yêu cầu xóa. Parent nên mở modal xác nhận và chỉ
      thực hiện xóa khi người dùng xác nhận.

  State cục bộ:
    - isEditing: boolean - đang ở chế độ chỉnh sửa inline hay không
    - newText: string - giá trị điều khiển cho input chỉnh sửa

  Hành vi:
    - Render checkbox, text của todo (hoặc input khi chỉnh sửa), và
      các icon cho sửa/xóa. Việc lưu xảy ra khi input blur (mất focus).
*/
function TodoItem({ todo, toggleTodo, deleteTodo, editTodo, requestDelete, onEmptyEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);

  // Save handler called when editing finishes (on blur).
  // If the new text is empty (or whitespace-only), call the parent
  // `onEmptyEdit` callback to show a validation warning and do NOT save.
  // Otherwise persist the change via editTodo.
  const handleSave = () => {
    if (!newText.trim()) {
      // Nếu rỗng: thông báo lỗi, phục hồi giá trị cũ và thoát chế độ chỉnh sửa
      if (typeof onEmptyEdit === "function") onEmptyEdit();
      setNewText(todo.text);
      setIsEditing(false);
      return;
    }
    // Nếu hợp lệ, lưu thay đổi và đóng chế độ chỉnh sửa
    editTodo(todo.id, newText);
    setIsEditing(false);
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        {/* Checkbox toggles completed state */}
        <input
          type="checkbox"
          className="form-check-input me-2"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />

        {/* When editing, show a text input bound to newText. Otherwise
            show the todo text; completed items get a strikethrough. */}
        {isEditing ? (
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onBlur={handleSave}
            autoFocus
          />
        ) : (
          <span
            className={todo.completed ? "text-decoration-line-through" : ""}
            style={{ cursor: "pointer" }}
          >
            {todo.text}
          </span>
        )}
      </div>

      <div>
        {/* Edit icon — enters inline edit mode. We use bootstrap-icons
            for visual consistency. */}
        <i
          className="bi bi-pencil-square text-warning me-3"
          style={{ cursor: "pointer", fontSize: "1.2rem" }}
          onClick={() => setIsEditing(true)}
        ></i>

        {/* Delete icon — calls requestDelete so the parent can confirm
            before deleting. */}
        <i
          className="bi bi-trash text-danger"
          style={{ cursor: "pointer", fontSize: "1.2rem" }}
          onClick={() => requestDelete(todo.id)}
        ></i>
      </div>
    </li>
  );
}

export default TodoItem;
