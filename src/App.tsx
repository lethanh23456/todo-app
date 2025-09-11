import React, { Component } from 'react';
import { Search, Plus, Filter, Calendar, MoreHorizontal, User, Star, X } from 'lucide-react';
import './App.scss';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: string;
  date: string;
  category: string;
}

interface Category {
  name: string;
  count: number;
  active?: boolean;
}

interface Project {
  name: string;
  color: string;
}

interface AppState {
  tasks: Task[];
  newTask: string;
  selectedCategory: string;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      tasks: [
        {
          id: 1,
          text: "Hoàn thành báo cáo dự án",
          completed: false,
          priority: "Cao",
          date: "2025-09-13",
          category: "work"
        },
        {
          id: 2,
          text: "Họp team buổi sáng",
          completed: true,
          priority: "Trung bình",
          date: "2025-09-12",
          category: "meeting"
        },
        {
          id: 3,
          text: "Review code của đồng nghiệp",
          completed: false,
          priority: "Thấp",
          date: "2025-09-14",
          category: "review"
        }
      ],
      newTask: "",
      selectedCategory: "Tất cả tasks"
    };
  }

  categories: Category[] = [
    { name: "Tất cả tasks", count: 3, active: true },
    { name: "Hôm nay", count: 1 },
    { name: "Sắp tới", count: 2 },
    { name: "Đã hoàn thành", count: 1 }
  ];

  projects: Project[] = [
    { name: "Dự án Website", color: "#ef4444" },
    { name: "App Mobile", color: "#22c55e" },
    { name: "Marketing", color: "#3b82f6" }
  ];

  toggleTask = (id: number): void => {
    this.setState(prevState => ({
      tasks: prevState.tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  addTask = (): void => {
    const { newTask, tasks } = this.state;
    if (newTask.trim()) {
      const newTaskObj: Task = {
        id: Date.now(),
        text: newTask,
        completed: false,
        priority: "Trung bình",
        date: new Date().toISOString().split('T')[0],
        category: "work"
      };
      
      this.setState({
        tasks: [...tasks, newTaskObj],
        newTask: ""
      });
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

  render() {
    const { tasks, newTask, selectedCategory } = this.state;
    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    return (
      <>
        
        <div className="app-container">
          {/* Sidebar */}
          <div className="sidebar">
            {/* Sidebar Header */}
            <div className="sidebar-header">
              <div className="header-controls">
                <button 
                  onClick={this.addTask}
                  className="new-task-btn"
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
                />
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="sidebar-content">
              {/* Categories */}
              <div className="category-section">
                <div className="section-title">DANH MỤC</div>
                <div className="category-list">
                  {this.categories.map((category, index) => (
                    <button
                      key={index}
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
                  {this.projects.map((project, index) => (
                    <button key={index} className="project-item">
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
                            <button className="task-remove">
                              <X size={16} />
                            </button>
                          </div>
                          <div className="task-meta">
                            <span className="task-date">
                              <Calendar size={14} />
                              {task.date}
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
                                <button className="task-remove">
                                  <X size={16} />
                                </button>
                              </div>
                              <div className="task-meta">
                                <span className="task-date">
                                  <Calendar size={14} />
                                  {task.date}
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
                {activeTasks.length === 0 && (
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
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;