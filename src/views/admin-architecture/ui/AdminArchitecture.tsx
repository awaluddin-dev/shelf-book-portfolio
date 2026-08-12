"use client";

import React from "react";
import { AdminImageNodesManager } from "@/widgets/admin-image-nodes-manager/ui/AdminImageNodesManager";

export default function AdminArchitecture() {
  return (
    <AdminImageNodesManager
      title="System Architecture Nodes"
      apiEndpoint="/api/architecture"
      imagePlaceholder="Image URL (e.g. /assets/arch1.png)"
      imageAlt="Architecture Preview"
    />
  );
}
