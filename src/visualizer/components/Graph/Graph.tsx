// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import cytoscape from "cytoscape";
import { FC, memo, NamedExoticComponent, useCallback, useEffect, useMemo, useRef } from "react";
import { debounceTime, Subject } from "rxjs";
import styled, { DefaultTheme, withTheme } from "styled-components";
import { useCytoscape } from "../../hooks";
import { CommandBar } from "./CommandBar";
import { createStylesheet } from "./style";

interface GraphProps {
  elements: cytoscape.ElementDefinition[];
  theme: DefaultTheme;
}

const layoutOptions = {
  name: "elk",
  padding: 100,
  fit: true,
  animate: true,
  animationDuration: 800,
  animationEasing: "cubic-bezier(0.33, 1, 0.68, 1)" as cytoscape.Css.TransitionTimingFunction,
  elk: {
    algorithm: "layered",
    "layered.layering.strategy": "INTERACTIVE",
    "layered.nodePlacement.bk.fixedAlignment": "BALANCED",
    "layered.cycleBreaking.strategy": "DEPTH_FIRST",
    "elk.direction": "DOWN",
    "elk.aspectRatio": 2.5,
    "spacing.nodeNodeBetweenLayers": 80,
    "spacing.baseValue": 120,
    "spacing.componentComponent": 100,
  },
};

const zoomOptions = {
  minLevel: 0.2,
  maxLevel: 2,
  sensitivity: 0.1,
};

const GraphContainer = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.canvas.backgroundColor};
  background-image: ${({ theme }) => theme.canvas.backgroundImage};
  background-size: 24px 24px;
  background-position: 12px 12px;
`;

const resizeRequest$ = new Subject<void>();

const GraphComponent: FC<GraphProps> = ({ elements, theme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const styleSheet = useMemo(() => createStylesheet(theme), [theme]);
  const [cytoscapeRef, layoutRef] = useCytoscape(elements, styleSheet, {
    containerRef,
    layoutOptions,
    zoomOptions,
    onNodeDoubleTap: useCallback((event: cytoscape.EventObjectNode) => {
      const filePath = event.target.data("filePath");
      const range = event.target.data("range");
      // vscode.postMessage(createRevealFileRangeMessage(filePath, range));
      // HACK
      console.log(`[HACK]`, { filePath, range });
    }, []),
  });

  // auto reset on window resize, use resize observer
  useEffect(() => {
    const handleResize = () => resizeRequest$.next();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current!);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const subscription = resizeRequest$.pipe(debounceTime(200)).subscribe(() => {
      cytoscapeRef.current?.reset();
      cytoscapeRef.current?.center();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleZoomIn = useCallback(() => {
    cytoscapeRef.current?.zoom(cytoscapeRef.current.zoom() + 0.1);
  }, []);

  const handleZoomOut = useCallback(() => {
    cytoscapeRef.current?.zoom(cytoscapeRef.current.zoom() - 0.1);
  }, []);

  const handleLayout = useCallback(() => {
    layoutRef.current?.run();
  }, []);

  const handleFit = useCallback(() => {
    cytoscapeRef.current?.animate(
      {
        fit: {
          eles: cytoscapeRef.current.elements(),
          padding: layoutOptions.padding,
        },
      },
      {
        easing: layoutOptions.animationEasing,
        duration: layoutOptions.animationDuration,
      }
    );
  }, []);

  return (
    <>
      <GraphContainer ref={containerRef} theme={theme} />
      <CommandBar onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onLayout={handleLayout} onFit={handleFit} />
    </>
  );
};

export const Graph = memo(
  withTheme(GraphComponent) as typeof GraphComponent,
  (prevProps, nextProps) =>
    prevProps.theme === nextProps.theme &&
    prevProps.elements.length === nextProps.elements.length &&
    prevProps.elements.every((prevElement, i) => {
      const prevData = prevElement.data;
      const nextData = nextProps.elements[i].data;

      return (
        prevData.id === nextData.id &&
        prevData.hasError === nextData.hasError &&
        prevData.filePath === nextData.filePath &&
        prevData.range?.start?.line === nextData.range?.start?.line &&
        prevData.range?.start?.character === nextData.range?.start?.character &&
        prevData.range?.end?.line === nextData.range?.end?.line &&
        prevData.range?.end?.character === nextData.range?.end?.character &&
        prevData.backgroundDataUri === nextData.backgroundDataUri &&
        prevData.source === nextData.source &&
        prevData.target === nextData.target
      );
    })
  // Workaround for https://github.com/styled-components/styled-components/issues/4082.
) as NamedExoticComponent<Omit<GraphProps, "theme">>;
