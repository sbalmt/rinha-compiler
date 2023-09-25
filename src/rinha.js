const Core = require('@xcheme/core');
const L1_EXTRA = new Core.ExpectUnitPattern('_');const L1_ALPHA = new Core.ChooseFlowPattern(new Core.RangeUnitPattern('A', 'Z'), new Core.RangeUnitPattern('a', 'z'));const L1_DIGIT = new Core.RangeUnitPattern('0', '9');const L1_WORD = new Core.ChooseFlowPattern(L1_EXTRA, L1_ALPHA, L1_DIGIT);exports.Lexer = new Core.ExpectFlowPattern(new Core.OptFlowPattern(new Core.RepeatFlowPattern(new Core.ChooseFlowPattern(new Core.MapFlowPattern(new Core.UnitRoute(' '), new Core.UnitRoute('\t'), new Core.UnitRoute('\v'), new Core.UnitRoute('\f'), new Core.UnitRoute('\r'), new Core.UnitRoute('\n'), new Core.FlowRoute(new Core.ExpectFlowPattern(new Core.OptFlowPattern(new Core.RepeatFlowPattern(new Core.ConditionFlowPattern(new Core.NotFlowPattern(new Core.ExpectUnitPattern('*', '/')), new Core.AnyUnitPattern()))), new Core.OptFlowPattern(new Core.ExpectUnitPattern('*', '/'))), '/', '*'), new Core.FlowRoute(new Core.OptFlowPattern(new Core.RepeatFlowPattern(new Core.ConditionFlowPattern(new Core.NotFlowPattern(new Core.ExpectUnitPattern('\n')), new Core.AnyUnitPattern()))), '/', '/')), new Core.EmitTokenPattern(4294967295, new Core.ExpectFlowPattern(new Core.MapFlowPattern(new Core.SetValueRoute(100, 'l', 'e', 't'), new Core.SetValueRoute(101, 'f', 'n'), new Core.SetValueRoute(120, 't', 'r', 'u', 'e'), new Core.SetValueRoute(121, 'f', 'a', 'l', 's', 'e'), new Core.SetValueRoute(150, 'i', 'f'), new Core.SetValueRoute(151, 'e', 'l', 's', 'e')), new Core.NotFlowPattern(L1_WORD))), new Core.EmitTokenPattern(250, new Core.ExpectFlowPattern(new Core.ChooseFlowPattern(L1_ALPHA, L1_EXTRA), new Core.OptFlowPattern(new Core.RepeatFlowPattern(L1_WORD)))), new Core.EmitTokenPattern(251, new Core.ChooseFlowPattern(new Core.ExpectUnitPattern('0'), new Core.ExpectFlowPattern(new Core.RangeUnitPattern('1', '9'), new Core.OptFlowPattern(new Core.RepeatFlowPattern(L1_DIGIT))))), new Core.EmitTokenPattern(252, new Core.ChooseFlowPattern(new Core.ExpectFlowPattern(new Core.ExpectUnitPattern('\''), new Core.RepeatFlowPattern(new Core.ConditionFlowPattern(new Core.ExpectUnitPattern('\\'), new Core.AnyUnitPattern(), new Core.ConditionFlowPattern(new Core.NotFlowPattern(new Core.ExpectUnitPattern('\'')), new Core.AnyUnitPattern()))), new Core.ExpectUnitPattern('\'')), new Core.ExpectFlowPattern(new Core.ExpectUnitPattern('"'), new Core.RepeatFlowPattern(new Core.ConditionFlowPattern(new Core.ExpectUnitPattern('\\'), new Core.AnyUnitPattern(), new Core.ConditionFlowPattern(new Core.NotFlowPattern(new Core.ExpectUnitPattern('"')), new Core.AnyUnitPattern()))), new Core.ExpectUnitPattern('"')))), new Core.EmitTokenPattern(4294967295, new Core.MapFlowPattern(new Core.SetValueRoute(300, '='), new Core.SetValueRoute(301, '+'), new Core.SetValueRoute(302, '-'), new Core.SetValueRoute(303, '*'), new Core.SetValueRoute(304, '/'), new Core.SetValueRoute(305, '%'), new Core.SetValueRoute(306, '<'), new Core.SetValueRoute(307, '>'), new Core.SetValueRoute(308, '('), new Core.SetValueRoute(309, ')'), new Core.SetValueRoute(310, '{'), new Core.SetValueRoute(311, '}'), new Core.SetValueRoute(312, ','), new Core.SetValueRoute(313, ';'), new Core.SetValueRoute(314, '=', '='), new Core.SetValueRoute(315, '!', '='), new Core.SetValueRoute(316, '<', '='), new Core.SetValueRoute(317, '>', '='), new Core.SetValueRoute(318, '=', '>'), new Core.SetValueRoute(319, '|', '|'), new Core.SetValueRoute(320, '&', '&')))))), new Core.StopFlowPattern());
const L0_FUNCTION_PARAM = new Core.ExpectFlowPattern(new Core.AppendNodePattern(1100, 1, 2, new Core.EmitSymbolPattern(2000, new Core.ExpectUnitPattern(250))), new Core.OptFlowPattern(new Core.ExpectUnitPattern(312), new Core.RunFlowPattern(() => L0_FUNCTION_PARAM)));const L0_FUNCTION_PARAMETERS = new Core.ExpectFlowPattern(new Core.ExpectUnitPattern(308), new Core.AppendNodePattern(1401, 1, 1, new Core.OptFlowPattern(L0_FUNCTION_PARAM)), new Core.ExpectUnitPattern(309));const L0_ASSIGN_OP = new Core.ExpectUnitPattern(300);const L0_LOGICAL_OR_OP = new Core.ExpectUnitPattern(319);const L0_LOGICAL_AND_OP = new Core.ExpectUnitPattern(320);const L0_EQUALITY_OP = new Core.MapFlowPattern(new Core.SetValueRoute(1203, 314), new Core.SetValueRoute(1204, 315));const L0_RELATIONAL_OP = new Core.MapFlowPattern(new Core.SetValueRoute(1205, 307), new Core.SetValueRoute(1206, 306), new Core.SetValueRoute(1207, 317), new Core.SetValueRoute(1208, 316));const L0_ADD_OP = new Core.MapFlowPattern(new Core.SetValueRoute(1209, 301), new Core.SetValueRoute(1210, 302));const L0_MULTIPLY_OP = new Core.MapFlowPattern(new Core.SetValueRoute(1211, 303), new Core.SetValueRoute(1212, 304), new Core.SetValueRoute(1213, 305));const L0_INVOKE_ARG_LIST_STMT_BLOCK = new Core.ExpectFlowPattern(new Core.PlaceNodePattern(2, new Core.RunFlowPattern(() => L0_EXPR_STMT_BLOCK)), new Core.OptFlowPattern(new Core.ExpectUnitPattern(312), new Core.RunFlowPattern(() => L0_INVOKE_ARG_LIST_STMT_BLOCK)));const L0_VALUE_EXPR_STMT_BLOCK = new Core.ChooseFlowPattern(new Core.AppendNodePattern(4294967295, 1, 1, new Core.MapFlowPattern(new Core.SetValueRoute(1100, 250), new Core.SetValueRoute(1101, 251), new Core.SetValueRoute(1102, 252), new Core.SetValueRoute(1103, 120), new Core.SetValueRoute(1103, 121), new Core.SetValueRoute(1104, new Core.ScopeSymbolPattern(L0_FUNCTION_PARAMETERS, new Core.ExpectUnitPattern(318), new Core.PlaceNodePattern(2, new Core.ChooseFlowPattern(new Core.RunFlowPattern(() => L0_STMT_BLOCK), new Core.AppendNodePattern(1402, 1, 1, new Core.AppendNodePattern(1300, 1, 1, new Core.RunFlowPattern(() => L0_EXPR_STMT_BLOCK)))))), 101), new Core.SetValueRoute(1105, new Core.ExpectFlowPattern(new Core.RunFlowPattern(() => L0_EXPR_STMT_BLOCK), new Core.ExpectUnitPattern(312), new Core.PlaceNodePattern(2, new Core.RunFlowPattern(() => L0_EXPR_STMT_BLOCK)), new Core.ExpectUnitPattern(309)), 308), new Core.SetValueRoute(1106, new Core.ExpectFlowPattern(new Core.RunFlowPattern(() => L0_IF_BODY), new Core.RunFlowPattern(() => L0_ELSE_BODY)), 150))), new Core.PlaceNodePattern(1, new Core.ExpectUnitPattern(308), new Core.RunFlowPattern(() => L0_EXPR_STMT_BLOCK), new Core.ExpectUnitPattern(309)));const L0_INVOKE_EXPR_STMT_BLOCK = new Core.ExpectFlowPattern(new Core.RunFlowPattern(() => L0_VALUE_EXPR_STMT_BLOCK), new Core.OptFlowPattern(new Core.RepeatFlowPattern(new Core.PivotNodePattern(1214, 1, 0, new Core.ExpectFlowPattern(new Core.ExpectUnitPattern(308), new Core.OptFlowPattern(L0_INVOKE_ARG_LIST_STMT_BLOCK), new Core.ExpectUnitPattern(309))))));const L0_MULTIPLY_EXPR_STMT_BLOCK = new Core.ExpectFlowPattern(new Core.RunFlowPattern(() => L0_INVOKE_EXPR_STMT_BLOCK), new Core.OptFlowPattern(new Core.RepeatFlowPattern(new Core.PivotNodePattern(4294967295, 1, 0, new Core.RunFlowPattern(() => L0_MULTIPLY_OP), new Core.RunFlowPattern(() => L0_INVOKE_EXPR_STMT_BLOCK)))));const L0_ADD_EXPR_STMT_BLOCK = new Core.ExpectFlowPattern(new Core.RunFlowPattern(() => L0_MULTIPLY_EXPR_STMT_BLOCK), new Core.OptFlowPattern(new Core.RepeatFlowPattern(new Core.PivotNodePattern(4294967295, 1, 0, new Core.RunFlowPattern(() => L0_ADD_OP), new Core.RunFlowPattern(() => L0_MULTIPLY_EXPR_STMT_BLOCK)))));const L0_RELATIONAL_EXPR_STMT_BLOCK = new Core.ExpectFlowPattern(new Core.RunFlowPattern(() => L0_ADD_EXPR_STMT_BLOCK), new Core.OptFlowPattern(new Core.RepeatFlowPattern(new Core.PivotNodePattern(4294967295, 1, 0, new Core.RunFlowPattern(() => L0_RELATIONAL_OP), new Core.RunFlowPattern(() => L0_ADD_EXPR_STMT_BLOCK)))));const L0_EQUALITY_EXPR_STMT_BLOCK = new Core.ExpectFlowPattern(new Core.RunFlowPattern(() => L0_RELATIONAL_EXPR_STMT_BLOCK), new Core.OptFlowPattern(new Core.RepeatFlowPattern(new Core.PivotNodePattern(4294967295, 1, 0, new Core.RunFlowPattern(() => L0_EQUALITY_OP), new Core.RunFlowPattern(() => L0_RELATIONAL_EXPR_STMT_BLOCK)))));const L0_LOGICAL_AND_EXPR_STMT_BLOCK = new Core.ExpectFlowPattern(new Core.RunFlowPattern(() => L0_EQUALITY_EXPR_STMT_BLOCK), new Core.OptFlowPattern(new Core.RepeatFlowPattern(new Core.PivotNodePattern(4294967295, 1, 0, new Core.SetValuePattern(1202, new Core.RunFlowPattern(() => L0_LOGICAL_AND_OP)), new Core.RunFlowPattern(() => L0_EQUALITY_EXPR_STMT_BLOCK)))));const L0_LOGICAL_OR_EXPR_STMT_BLOCK = new Core.ExpectFlowPattern(new Core.RunFlowPattern(() => L0_LOGICAL_AND_EXPR_STMT_BLOCK), new Core.OptFlowPattern(new Core.RepeatFlowPattern(new Core.PivotNodePattern(4294967295, 1, 0, new Core.SetValuePattern(1201, new Core.RunFlowPattern(() => L0_LOGICAL_OR_OP)), new Core.RunFlowPattern(() => L0_LOGICAL_AND_EXPR_STMT_BLOCK)))));const L0_EXPR_STMT_BLOCK = new Core.ExpectFlowPattern(new Core.RunFlowPattern(() => L0_LOGICAL_OR_EXPR_STMT_BLOCK), new Core.OptFlowPattern(new Core.RepeatFlowPattern(new Core.PivotNodePattern(4294967295, 1, 0, new Core.SetValuePattern(1200, new Core.RunFlowPattern(() => L0_ASSIGN_OP)), new Core.RunFlowPattern(() => L0_LOGICAL_OR_EXPR_STMT_BLOCK)))));const L0_STMT_BLOCK = new Core.AppendNodePattern(1402, 1, 1, new Core.ExpectFlowPattern(new Core.ExpectUnitPattern(310), new Core.OptFlowPattern(new Core.RepeatFlowPattern(new Core.PlaceNodePattern(2, new Core.AppendNodePattern(4294967295, 1, 1, new Core.RunFlowPattern(() => L0_PROGRAM))))), new Core.ExpectUnitPattern(311)));const L0_IF_BODY = new Core.ExpectFlowPattern(new Core.ExpectFlowPattern(new Core.ExpectUnitPattern(308), new Core.AppendNodePattern(1400, 1, 1, L0_EXPR_STMT_BLOCK), new Core.ExpectUnitPattern(309)), new Core.PlaceNodePattern(2, new Core.ScopeSymbolPattern(L0_STMT_BLOCK)));const L0_ELSE_BODY = new Core.ExpectFlowPattern(new Core.ExpectUnitPattern(151), new Core.PlaceNodePattern(2, new Core.ScopeSymbolPattern(L0_STMT_BLOCK)));const L0_PROGRAM = new Core.ChooseFlowPattern(new Core.MapFlowPattern(new Core.SetValueRoute(1301, new Core.EmitSymbolPattern(2000, new Core.AppendNodePattern(1000, 1, 1, new Core.ExpectUnitPattern(250)), new Core.PlaceNodePattern(1, new Core.ExpectUnitPattern(300), L0_EXPR_STMT_BLOCK), new Core.ExpectUnitPattern(313)), 100), new Core.SetValueRoute(1302, new Core.ExpectFlowPattern(L0_IF_BODY, new Core.OptFlowPattern(L0_ELSE_BODY)), 150)), new Core.SetValuePattern(1300, L0_EXPR_STMT_BLOCK));exports.Parser = new Core.ExpectFlowPattern(new Core.OptFlowPattern(new Core.RepeatFlowPattern(new Core.ChooseFlowPattern(new Core.EmitNodePattern(4294967295, 1, L0_PROGRAM)))), new Core.StopFlowPattern());
