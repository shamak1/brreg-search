import { makeStyles, tokens } from '@fluentui/react-components';

export const useCompanyJsonViewerStyles = makeStyles({
  jsonViewer: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground1,
    padding: '12px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '12px',
    whiteSpace: 'pre-wrap',
    maxHeight: '400px',
    overflowY: 'auto',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
});
