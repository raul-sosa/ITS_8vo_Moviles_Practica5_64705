// app/services/api.ts
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://nursery-cleaning-gmc-eyes.trycloudflare.com/api";

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  completada: boolean;
}

export const api = {
  getTareas: async (): Promise<Tarea[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas`);
      if (!response.ok) throw new Error("Error fetching tareas");
      return await response.json();
    } catch (error) {
      console.error("Error fetching tareas:", error);
      throw error;
    }
  },

  getTarea: async (id: number): Promise<Tarea> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas/${id}`);
      if (!response.ok) throw new Error(`Error fetching tarea ${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching tarea ${id}:`, error);
      throw error;
    }
  },

  createTarea: async (tarea: Omit<Tarea, "id">): Promise<Tarea> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tarea),
      });
      if (!response.ok) throw new Error("Error creating tarea");
      return await response.json();
    } catch (error) {
      console.error("Error creating tarea:", error);
      throw error;
    }
  },

  updateTarea: async (id: number, tarea: Partial<Tarea>): Promise<Tarea> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tarea),
      });
      if (!response.ok) throw new Error(`Error updating tarea ${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error updating tarea ${id}:`, error);
      throw error;
    }
  },

  deleteTarea: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Error deleting tarea ${id}`);
    } catch (error) {
      console.error(`Error deleting tarea ${id}:`, error);
      throw error;
    }
  },
};
