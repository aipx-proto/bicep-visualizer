// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App, Graph } from "./visualizer/components/App";

export function createVisualizer(container: HTMLElement, initialData: Graph) {
  const root = createRoot(container);

  root.render(
    <StrictMode>
      <App graph={initialData} />
    </StrictMode>
  );

  const update = (newData: Graph) => {
    root.render(
      <StrictMode>
        <App graph={newData} />
      </StrictMode>
    );
  };
  const unmount = () => root.unmount();

  return {
    update,
    unmount,
  };
}
