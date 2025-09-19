import React, { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import FilterTabs from "./components/FilterTabs";
import TodoList from "./components/TodoList";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

function App() {
  // Tên key dùng để lưu trong localStorage
  const STORAGE_KEY = "todos";

  // `todos` lưu danh sách các công việc: { id, text, completed }
  // Ứng dụng giữ tất cả thao tác CRUD trong state cấp cao này để các
  // component con có thể đơn giản và ít trạng thái hơn khi có thể.
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem("todos");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // `filter` điều khiển những todo nào được hiển thị trong danh sách. Giá trị:
  // - "all": hiển thị tất cả
  // - "completed": chỉ hiển thị đã hoàn thành
  // - "pending": chỉ hiển thị chưa hoàn thành
  const [filter, setFilter] = useState("all");

  // Trạng thái modal / xóa
  // `modalOpen` cho biết modal xác nhận (dùng cho xóa) có đang hiển thị hay không.
  // `pendingDeleteId` lưu id của todo mà người dùng yêu cầu xóa; hành động xóa
  // chỉ thực hiện khi người dùng xác nhận trong modal.
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // Editing flow: when user requests edit from a TodoItem, we store the
  // todo object in `editingTodo` and populate the top form for editing.
  const [editingTodo, setEditingTodo] = useState(null);

  // `warningOpen` là modal riêng để hiển thị cảnh báo khi người dùng
  // cố gắng thêm todo rỗng. Điều này tách UI cảnh báo khỏi modal xác nhận xóa.
  const [warningOpen, setWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  // Đọc todos từ localStorage khi app mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        console.log(" Đọc từ localStorage:", parsed);
        if (Array.isArray(parsed)) {
          setTodos(parsed);
        }
      }
    } catch (e) {
      console.error("Không đọc được todos từ localStorage:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ghi todos vào localStorage mỗi khi `todos` thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      console.log("Ghi vào localStorage:", todos);
    } catch (e) {
      console.error("Không ghi được todos vào localStorage:", e);
    }
  }, [todos]);

  // Thêm một todo mới vào danh sách. Sử dụng Date.now() làm id đơn giản
  // và todo mới mặc định chưa hoàn thành.

  const addTodo = (text) => {
    const trimmed = text.trim();
    if (!trimmed) {
      showWarning("Tên công việc không được phép để trống.");
      return;
    }
    // kiểm tra trùng tên (không phân biệt hoa thường)
    const exists = todos.some(
      (t) => t.text.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      showWarning("Công việc bị trùng.");
      return;
    }

    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, completed: false },
    ]);
  };

  // Đổi trạng thái completed của todo có id `id`.
  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Xóa ngay todo có id cho trước. Hàm này được gọi sau khi người dùng
  // xác nhận trong modal.
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Gọi bởi TodoItem khi người dùng bấm nút xóa. Lưu id todo đang chờ xóa
  // và mở modal xác nhận.
  const requestDelete = (id) => {
    setPendingDeleteId(id);
    setModalOpen(true);
  };

  // Nếu người dùng xác nhận xóa thì thực hiện xóa và xóa trạng thái modal.
  const confirmDelete = () => {
    if (pendingDeleteId != null) {
      deleteTodo(pendingDeleteId);
      setPendingDeleteId(null);
    }
    setModalOpen(false);
  };

  // Huỷ thao tác xóa đang chờ và đóng modal xác nhận.
  const cancelDelete = () => {
    setPendingDeleteId(null);
    setModalOpen(false);
  };

  // Cập nhật nội dung text của một todo. Dùng khi chỉnh sửa công việc.
  const editTodo = (id, newText) => {
    const trimmed = newText.trim();
    if (!trimmed) {
      showWarning("Tên công việc không được phép để trống.");
      return;
    }
    // kiểm tra trùng tên cho edit: cho phép giữ nguyên nếu chỉ sửa bản thân
    const exists = todos.some(
      (t) => t.id !== id && t.text.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      showWarning("Công việc bị trùng.");
      return;
    }
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
    );
  };

  // Start edit: populate form with selected todo
  const startEdit = (todo) => {
    setEditingTodo(todo);
    // optionally focus input — handled by TodoForm via effect
  };

  // Called by TodoForm when updating an existing todo
  const updateTodo = (id, newText) => {
    editTodo(id, newText);
    // Clear editing state after update
    setEditingTodo(null);
  };

  const cancelEdit = () => setEditingTodo(null);

  // Lọc danh sách todo hiển thị dựa trên `filter` hiện tại.
  const filteredTodos = todos.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  // Các hàm helper để mở/đóng modal cảnh báo khi input trống.
  const showWarning = (message = "Có lỗi xảy ra.") => {
    setWarningMessage(message);
    setWarningOpen(true);
  };
  const closeWarning = () => setWarningOpen(false);

  return (
    <div className="app-wrapper">
      <div className="container p-4">
        <TodoForm
          addTodo={addTodo}
          onEmptySubmit={showWarning}
          editingTodo={editingTodo}
          updateTodo={updateTodo}
          cancelEdit={cancelEdit}
        />
        <FilterTabs filter={filter} setFilter={setFilter} />
        <TodoList
          todos={filteredTodos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
          requestDelete={requestDelete}
          onEmptyEdit={showWarning}
          startEdit={startEdit}
        />

        {/* Confirmation modal overlay */}
        <div className="overlay" hidden={!modalOpen}>
          <div className="modal-custom">
            <div className="modal-header-custom d-flex justify-content-between align-items-center">
              <h5>Xác nhận</h5>
              <button
                className="btn-close"
                aria-label="Close"
                onClick={cancelDelete}
              ></button>
            </div>
            <div className="modal-body-custom">
              <p>Bạn chắc chắn muốn xóa công việc này?</p>
            </div>
            <div className="modal-footer-footer d-flex justify-content-end">
              <button className="btn btn-light me-2" onClick={cancelDelete}>
                Hủy
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Xóa
              </button>
            </div>
          </div>
        </div>

        {/* Warning modal for empty submit */}
        <div className="overlay" hidden={!warningOpen}>
          <div className="modal-custom">
            <div className="modal-header-custom d-flex justify-content-between align-items-center">
              <h5>Cảnh Báo</h5>
              <button
                className="btn-close"
                aria-label="Close"
                onClick={closeWarning}
              ></button>
            </div>
            <div className="modal-body-custom">
              <p>{warningMessage || "Có lỗi xảy ra."}</p>
            </div>
            <div className="modal-footer-footer d-flex justify-content-end">
              <button className="btn btn-light" onClick={closeWarning}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
