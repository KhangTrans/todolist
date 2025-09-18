import React from "react";
import TodoItem from "./TodoItem";

/*
  TodoList

  Props:
    - todos: Array<{id, text, completed}>
      Danh sách todo để render. Component này không thay đổi danh sách;
      chỉ ánh xạ nó thành các component `TodoItem`.

    - toggleTodo(id): function
      Gọi khi một item đổi trạng thái completed.

    - deleteTodo(id): function
      Hàm xóa trực tiếp (không dùng nếu bạn dùng pattern `requestDelete`,
      nhưng vẫn cung cấp để đầy đủ).

    - editTodo(id, newText): function
      Gọi khi một item hoàn tất chỉnh sửa và cập nhật text.

    - requestDelete(id): function
      Pattern khuyến nghị: item gọi `requestDelete` để yêu cầu parent
      mở modal xác nhận. Parent sẽ thực hiện xóa nếu người dùng xác nhận.

  Hành vi:
    - Render một danh sách theo style bootstrap (`ul.list-group`) với một
      `TodoItem` cho mỗi todo. Các handler sự kiện được chuyển tiếp cho
      component con để component con giữ vai trò trình bày.
*/
function TodoList({ todos, toggleTodo, deleteTodo, editTodo, requestDelete, onEmptyEdit }) {
  return (
    <ul className="list-group">
      {todos.map((t) => (
        <TodoItem
          key={t.id}
          todo={t}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
          requestDelete={requestDelete}
          onEmptyEdit={onEmptyEdit}
        />
      ))}
    </ul>
  );
}

export default TodoList;
