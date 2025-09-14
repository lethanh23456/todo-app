import React, { Component } from 'react';
import { Search, Plus, Filter, Calendar, MoreHorizontal, User, Star, X, Loader2 } from 'lucide-react';
import { taskService } from './taskService';
import type { Task, Category, Project } from './taskService';
import './App.scss';

interface AppState {
  tasks: Task[];
  categories: Category[];
  projects: Project[];
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
      projects: [],
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

  loadData = async (): Promise<void> => {
    this.setState({ loading: true, error: null });
    
    try {
      const [tasks, categories, projects] = await Promise.all([
        taskService.getAllTasks(),
        taskService.getAllCategories(),
        taskService.getAllProjects()
      ]);

      this.setState({
        tasks,
        categories,
        projects,
        loading: false
      });
    } catch (error) {
      console.error('Error loading data:', error);
      this.setState({
        error: 'Không thể tải dữ liệu. Vui lòng kiểm tra JSON Server đã chạy chưa.',
        loading: false
      });
    }
  };

  toggleTask = async (id: number): Promise<void> => {
    try {
      const updatedTask = await taskService.toggleTask(id);
      
      this.setState(prevState => ({
        tasks: prevState.tasks.map(task => 
          task.id === id ? updatedTask : task
        )
      }));
    } catch (error) {
      console.error('Error toggling task:', error);
      this.setState({ error: 'Không thể cập nhật task' });
    }
  };

  addTask = async (): Promise<void> => {
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
      console.error('Error adding task:', error);
      this.setState({ error: 'Không thể thêm task mới' });
    }
  };

  deleteTask = async (id: number): Promise<void> => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa task này?')) return;

    try {
      await taskService.deleteTask(id);
      
      this.setState(prevState => ({
        tasks: prevState.tasks.filter(task => task.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
      this.setState({ error: 'Không thể xóa task' });
    }
  };

  updateTask = async (id: number, updates: Partial<Task>): Promise<void> => {
    try {
      const updatedTask = await taskService.updateTask(id, updates);
      
      this.setState(prevState => ({
        tasks: prevState.tasks.map(task => 
          task.id === id ? updatedTask : task
        )
      }));
    } catch (error) {
      console.error('Error updating task:', error);
      this.setState({ error: 'Không thể cập nhật task' });
    }
  };

  handleNewTaskChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ newTask: e.target.value });
  };

  handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      this.addTask();
    }
  };

  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchQuery: e.target.value });
  };

  setSelectedCategory = (categoryName: string): void => {
    this.setState({ selectedCategory: categoryName });
  };

  getPriorityColor = (priority: string): string => {
    switch(priority) {
      case "Cao": return "#ef4444";
      case "Trung bình": return "#f59e0b";
      case "Thấp": return "#22c55e";
      default: return "#6b7280";
    }
  };

  focusNewTaskInput = (): void => {
    const input = document.getElementById('newTaskInput') as HTMLInputElement;
    if (input) input.focus();
  };

  getFilteredTasks = (): { activeTasks: Task[], completedTasks: Task[] } => {
    const { tasks, selectedCategory, searchQuery } = this.state;
    
    let filteredTasks = tasks;

    // Lọc theo search query
    if (searchQuery.trim()) {
      filteredTasks = filteredTasks.filter(task =>
        task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.priority.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Lọc theo category
    if (selectedCategory !== "Tất cả tasks") {
      const today = new Date().toISOString().split('T')[0];
      
      switch (selectedCategory) {
        case "Hôm nay":
          filteredTasks = filteredTasks.filter(task => task.date === today);
          break;
        case "Sắp tới":
          filteredTasks = filteredTasks.filter(task => task.date > today);
          break;
        case "Đã hoàn thành":
          filteredTasks = filteredTasks.filter(task => task.completed);
          break;
      }
    }

    return {
      activeTasks: filteredTasks.filter(task => !task.completed),
      completedTasks: filteredTasks.filter(task => task.completed)
    };
  };

  dismissError = (): void => {
    this.setState({ error: null });
  };

  render() {
    const { newTask, selectedCategory, loading, error, searchQuery, categories, projects } = this.state;
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
        {/* Error Toast */}
        {error && (
          <div className="error-toast">
            <span>{error}</span>
            <button onClick={this.dismissError} className="error-close">
              <X size={16} />
            </button>
          </div>
        )}
        
        <div className="app-container">
          {/* Sidebar */}
          <div className="sidebar">
            {/* Sidebar Header */}
            <div className="sidebar-header">
              <div className="header-controls">
                <button 
                  onClick={this.addTask}
                  className="new-task-btn"
                  disabled={!newTask.trim()}
                >
                  New Task
                </button>
                <div className="icon-controls">
                  <button className="icon-btn">
                    <Search size={20} />
                  </button>
                  <button className="icon-btn">
                    <Filter size={20} />
                  </button>
                </div>
              </div>
              
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

            {/* Sidebar Content */}
            <div className="sidebar-content">
              {/* Categories */}
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

              {/* Projects */}
              <div className="project-section">
                <div className="section-title">DỰ ÁN</div>
                <div className="project-list">
                  {projects.map((project) => (
                    <button key={project.id} className="project-item">
                      <div 
                        className="project-indicator"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="project-name">{project.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            {/* Main Header */}
            <div className="main-header">
              <div className="main-header-content">
                <div className="main-title-section">
                  <h1 className="main-title">{selectedCategory}</h1>
                  <span className="task-count">{activeTasks.length} tasks</span>
                  <button className="icon-btn">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
                <div className="main-controls">
                  <button className="today-btn">
                    <Calendar size={16} />
                    <span>Today</span>
                  </button>
                  <div className="user-info">
                    <span className="user-text">Người dùng (3)</span>
                    <button className="icon-btn">
                      <User size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Body */}
            <div className="main-body">
              <div className="main-container">
                {/* Add New Task */}
                <div className="content-section">
                  <div className="add-task-section">
                    <button
                      onClick={this.focusNewTaskInput}
                      className="add-task-trigger"
                    >
                      <Plus size={20} />
                      <span>Thêm task mới</span>
                    </button>
                    <input
                      id="newTaskInput"
                      type="text"
                      value={newTask}
                      onChange={this.handleNewTaskChange}
                      onKeyPress={this.handleKeyPress}
                      placeholder="Nhập tên task..."
                      className="new-task-input"
                    />
                  </div>
                </div>

                {/* Active Tasks */}
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

                {/* Completed Tasks */}
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

                {/* Empty State */}
                {activeTasks.length === 0 && !searchQuery && (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <Plus size={32} />
                    </div>
                    <h3 className="empty-title">Không có task nào</h3>
                    <p className="empty-description">Bắt đầu bằng cách thêm task đầu tiên của bạn</p>
                    <button
                      onClick={this.focusNewTaskInput}
                      className="primary-btn"
                    >
                      Thêm task đầu tiên
                    </button>
                  </div>
                )}

                {/* No Search Results */}
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