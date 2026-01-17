export const mermaidGrammar = `
root ::= flowchart
flowchart ::= "graph" space orientation statement_block
orientation ::= ("TB" | "TD" | "BT" | "RL" | "LR")
statement_block ::= statement+
statement ::= space (node_def | link_def)
node_def ::= node_id (space node_shape)?
node_shape ::= ("[" label "]") | ("(" label ")") | ("{" label "}")
link_def ::= node_id space link_style space node_id (space "|" label "|")?
link_style ::= ("-->" | "---" | "-.->" | "==>")
node_id ::= [a-zA-Z0-9_]+
label ::= [a-zA-Z0-9_ ]+
space ::= [ \\t\\n]+
`;
