import React, { Component } from 'react';
import { Search, Plus, Calendar, X, Loader2 } from 'lucide-react';
import { taskService } from './taskService';
import type { Task, Category } from './taskService';
import './App.scss';

interface AppState {
  tasks: Task[];
  categories: Category[];
  newTask: string;
  selectedCategory: string;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      tasks: [],
      categories: [],
      newTask: "",
      selectedCategory: "Tất cả tasks",
      loading: true,
      error: null,
      searchQuery: ""
    };
  }

  async componentDidMount() {
    await this.loadData();
  }

  loadData = async () => {
    this.setState({ loading: true, error: null });
    
    try {
      const [tasks, categories] = await Promise.all([
        taskService.getAllTasks(),
        taskService.getAllCategories(),
      ]);

      this.setState({ tasks, categories, loading: false });
    } catch (error) {
      this.setState({
        error: 'Không thể tải dữ liệu',
        loading: false
      });
    }
  };

  toggleTask = async (id: number) => {
    try {
      const updatedTask = await taskService.toggleTask(id);
      this.setState(prevState => ({
        tasks: prevState.tasks.map(task => 
          task.id === id ? updatedTask : task
        )
      }));
    } catch (error) {
      this.setState({ error: 'Không thể cập nhật task' });
    }
  };

  addTask = async () => {
    const { newTask } = this.state;
    if (!newTask.trim()) return;

    try {
      const newTaskObj = {
        text: newTask,
        completed: false,
        priority: "Trung bình",
        date: new Date().toISOString().split('T')[0],
        category: "work"
      };

      const createdTask = await taskService.createTask(newTaskObj);
      this.setState(prevState => ({
        tasks: [...prevState.tasks, createdTask],
        newTask: ""
      }));
    } catch (error) {
      this.setState({ error: 'Không thể thêm task mới' });
    }
  };

  deleteTask = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa task này?')) return;

    try {
      await taskService.deleteTask(id);
      this.setState(prevState => ({
        tasks: prevState.tasks.filter(task => task.id !== id)
      }));
    } catch (error) {
      this.setState({ error: 'Không thể xóa task' });
    }
  };

  handleNewTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  this.setState({ newTask: e.target.value });
};

  handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    this.addTask();
  }
};

 handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  this.setState({ searchQuery: e.target.value });
};

  setSelectedCategory = (categoryName: string) => {
  this.setState({ selectedCategory: categoryName });
};

 getPriorityColor = (priority: string) => {
  switch(priority) {
    case "Cao": return "#ef4444";
    case "Trung bình": return "#f59e0b";  
    case "Thấp": return "#22c55e";
    default: return "#6b7280";
  }
};

  getFilteredTasks = () => {
    const { tasks, selectedCategory, searchQuery } = this.state;
    
    let filteredTasks = tasks;

    if (searchQuery.trim()) {
      filteredTasks = filteredTasks.filter(task =>
        task.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory === "Đã hoàn thành") {
      filteredTasks = filteredTasks.filter(task => task.completed);
    }

    return {
      activeTasks: filteredTasks.filter(task => !task.completed),
      completedTasks: filteredTasks.filter(task => task.completed)
    };
  };

  dismissError = () => {
    this.setState({ error: null });
  };

  render() {
    const { newTask, selectedCategory, loading, error, searchQuery, categories } = this.state;
    const { activeTasks, completedTasks } = this.getFilteredTasks();

    if (loading) {
      return (
        <div className="loading-container">
          <Loader2 className="loading-spinner" size={32} />
          <p>Đang tải dữ liệu...</p>
        </div>
      );
    }

    return (
      <>
        {error && (
          <div className="error-toast">
            <span>{error}</span>
            <button onClick={this.dismissError} className="error-close">
              <X size={16} />
            </button>
          </div>
        )}
        
        <div className="app-container">
          <div className="sidebar">
            <div className="sidebar-header">
              <div className="search-container">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tasks..."
                  className="search-input"
                  value={searchQuery}
                  onChange={this.handleSearchChange}
                />
              </div>
            </div>

            <div className="sidebar-content">
              <div className="category-section">
                <div className="section-title">DANH MỤC</div>
                <div className="category-list">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => this.setSelectedCategory(category.name)}
                      className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
                    >
                      <span className="category-name">{category.name}</span>
                      <span className="category-count">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="main-content">
            <div className="main-header">
              <div className="main-header-content">
                <div className="main-title-section">
                  <h1 className="main-title">{selectedCategory}</h1>
                  <span className="task-count">{activeTasks.length} tasks</span>
                </div>
              </div>
            </div>

            <div className="main-body">
              <div className="main-container">
                <div className="content-section">
                  <div className="add-task-section">
                    <div className="add-task-trigger">
                      <Plus size={20} />
                      <span>Thêm task mới</span>
                    </div>
                    <input
                      type="text"
                      value={newTask}
                      onChange={this.handleNewTaskChange}
                      onKeyPress={this.handleKeyPress}
                      placeholder="Nhập tên task..."
                      className="new-task-input"
                    />
                  </div>
                </div>

                {activeTasks.map((task) => (
                  <div key={task.id} className="content-section">
                    <div className="task-card">
                      <div className="task-content">
                        <button
                          onClick={() => this.toggleTask(task.id)}
                          className="task-checkbox"
                        />
                        <div className="task-details">
                          <div className="task-header">
                            <h3 className="task-title">{task.text}</h3>
                            <button 
                              className="task-remove"
                              onClick={() => this.deleteTask(task.id)}
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="task-meta">
                            <span className="task-date">
                              <Calendar size={14} />
                              {new Date(task.date).toLocaleDateString('vi-VN')}
                            </span>
                            <span 
                              className="task-priority"
                              style={{ backgroundColor: this.getPriorityColor(task.priority) }}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {completedTasks.length > 0 && (
                  <div className="completed-section">
                    <div className="section-header">
                      <span>Đã hoàn thành</span>
                      <span>({completedTasks.length})</span>
                    </div>
                    {completedTasks.map((task) => (
                      <div key={task.id} className="content-section">
                        <div className="task-card completed-task-card">
                          <div className="task-content">
                            <button
                              onClick={() => this.toggleTask(task.id)}
                              className="task-checkbox completed"
                            >
                              <svg className="check-icon" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <div className="task-details">
                              <div className="task-header">
                                <h3 className="task-title completed">{task.text}</h3>
                                <button 
                                  className="task-remove"
                                  onClick={() => this.deleteTask(task.id)}
                                >
                                  <X size={16} />
                                </button>
                              </div>
                              <div className="task-meta">
                                <span className="task-date">
                                  <Calendar size={14} />
                                  {new Date(task.date).toLocaleDateString('vi-VN')}
                                </span>
                                <span className="task-priority" style={{ backgroundColor: '#e5e7eb', color: '#6b7280' }}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTasks.length === 0 && !searchQuery && (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <Plus size={32} />
                    </div>
                    <h3 className="empty-title">Không có task nào</h3>
                    <p className="empty-description">Bắt đầu bằng cách thêm task đầu tiên của bạn</p>
                  </div>
                )}

                {activeTasks.length === 0 && searchQuery && (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <Search size={32} />
                    </div>
                    <h3 className="empty-title">Không tìm thấy kết quả</h3>
                    <p className="empty-description">Không có task nào khớp với từ khóa "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;