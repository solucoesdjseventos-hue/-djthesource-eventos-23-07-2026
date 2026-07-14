const { supabase } = require("../utils/supabaseClient");

const getServices = async (req, res) => {
  try {
    const { data, error } = await supabase.from("services").select("*");
    if (error) {
      console.error("Supabase getServices error:", error);
      return res.status(500).json({ error: "Erro ao buscar serviços" });
    }
    return res.json(data || []);
  } catch (err) {
    console.error("getServices unexpected error:", err);
    return res.status(500).json({ error: "Erro ao buscar serviços" });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", req.params.id)
      .maybeSingle();

    if (error) {
      console.error("Supabase getServiceById error:", error);
      return res.status(500).json({ error: "Erro ao buscar serviço" });
    }

    if (!data) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    return res.json(data);
  } catch (err) {
    console.error("getServiceById unexpected error:", err);
    return res.status(500).json({ error: "Erro ao buscar serviço" });
  }
};

const editService = async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      rateLabel,
      unitLabel,
      basePrice,
      values,
      hourly,
      options,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID do serviço é obrigatório" });
    }

    const updatedService = {
      title,
      description,
      rateLabel,
      unitLabel,
      basePrice,
      values,
      hourly: typeof hourly === "boolean" ? hourly : undefined,
      options: Array.isArray(options) ? options : undefined,
      editable: true,
    };

    Object.keys(updatedService).forEach((key) => {
      if (updatedService[key] === undefined) {
        delete updatedService[key];
      }
    });

    const { data, error } = await supabase
      .from("services")
      .update(updatedService)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase editService error:", error);
      return res.status(500).json({ error: "Erro ao atualizar serviço" });
    }

    if (!data) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    return res.json(data);
  } catch (err) {
    console.error("editService unexpected error:", err);
    return res.status(500).json({ error: "Erro ao atualizar serviço" });
  }
};

const addService = async (req, res) => {
  try {
    const {
      title,
      description,
      rateLabel,
      unitLabel,
      basePrice,
      values,
      hourly,
      options,
    } = req.body;

    if (
      !title ||
      !description ||
      !rateLabel ||
      !unitLabel ||
      typeof basePrice !== "number" ||
      !Array.isArray(values)
    ) {
      return res
        .status(400)
        .json({ error: "Dados incompletos para criar novo serviço" });
    }

    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const { data: existing, error: existingError } = await supabase
      .from("services")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (existingError) {
      console.error("Supabase addService existing check error:", existingError);
      return res.status(500).json({ error: "Erro ao validar serviço" });
    }

    if (existing) {
      return res
        .status(400)
        .json({ error: "Já existe um serviço com esse nome" });
    }

    const newService = {
      id,
      title,
      description,
      rateLabel,
      unitLabel,
      basePrice,
      values,
      editable: true,
      hourly: Boolean(hourly),
      options: Array.isArray(options) ? options : null,
    };

    const { data, error } = await supabase
      .from("services")
      .insert([newService])
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase addService error:", error);
      return res.status(500).json({ error: "Erro ao criar serviço" });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error("addService unexpected error:", err);
    return res.status(500).json({ error: "Erro ao criar serviço" });
  }
};

module.exports = { getServices, getServiceById, editService, addService };
