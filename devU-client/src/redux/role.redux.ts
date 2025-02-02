// Define types for actions
type UpdateUserRoleAction = {
  type: 'UPDATE_USER_ROLE';
  payload: string;
};

// Action Types
type UserActionTypes = UpdateUserRoleAction;

// Action Creators
export const updateUserRole = (newRole: string): UpdateUserRoleAction => ({
  type: 'UPDATE_USER_ROLE',
  payload: newRole,
})

// Define interface for the initial state
interface UserState {
  userRole: string;
  isInstructor: () => boolean
}

// Load initial state from localStorage if available
const initialState: UserState = {
  userRole: localStorage.getItem('userRole') || 'Student', // Default role is 'student'
  isInstructor: function() {
    return this.userRole === 'Instructor';
  },
}

// Reducer
const reducer = (state: UserState = initialState, action: UserActionTypes): UserState => {
  switch (action.type) {
    case 'UPDATE_USER_ROLE':
      // Save to localStorage when role is updated
      localStorage.setItem('userRole', action.payload)
      return {
        ...state,
        userRole: action.payload,
      }
    default:
      return state
  }
}

export default reducer
