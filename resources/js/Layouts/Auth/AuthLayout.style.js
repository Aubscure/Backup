export const sx = {
  mainContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    px: 2,
  },

  card: {
    width: "100%",
    maxWidth: "1000px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0px 10px 25px rgba(0,0,0,0.08)",
    display: "flex",
    overflow: "hidden",
    flexDirection: {
      xs: "column",
      md: "row",
    },
  },

  leftPanel: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: {
      xs: "20px",
      md: "40px",
    },
    display: {
      xs: "none",
      md: "flex",
    },
    flexDirection: "column",
    justifyContent: "center",
  },

  rightPanel: {
    flex: 1,
    padding: {
      xs: "24px",
      md: "40px",
    },
  },

  leftTitle: {
    fontWeight: "bold",
    fontSize: "18px",
    color: "#111827",
  },

  leftDesc: {
    fontSize: "14px",
    color: "#6b7280",
    mt: 1,
  },
};