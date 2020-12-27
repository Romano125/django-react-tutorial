export interface TodoData {
  completed?: boolean;
  created_at?: Date;
  description?: string;
  id?: number;
  label?: string;
}

export interface TodosState {
  data: Array<TodoData>;
  hasLoaded: boolean;
}

export interface TodosPayload {
  data: Array<TodoData>;
}

export interface TodosCreatePayload {
  data: TodoData;
}
