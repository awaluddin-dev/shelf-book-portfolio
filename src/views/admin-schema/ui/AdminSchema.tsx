"use client";

import React from "react";
import { AdminImageNodesManager } from "@/widgets/admin-image-nodes-manager/ui/AdminImageNodesManager";

export default function AdminSchema() {
  return (
    <AdminImageNodesManager
      title="Database Schema Nodes"
      apiEndpoint="/api/database-schema"
      imagePlaceholder="Image URL (e.g. /assets/schema1.png)"
      imageAlt="Schema Preview"
    />
  );
}
