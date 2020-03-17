using Reinforced.Typings;
using Reinforced.Typings.Ast;
using Reinforced.Typings.Generators;
using System;

namespace EdatTemplate
{
    public class ReinforcedTypingsEntityInterfaceCodeGenerator : InterfaceCodeGenerator
    {
        public override RtInterface GenerateNode(Type element, RtInterface result, TypeResolver resolver)
        {
            var r = base.GenerateNode(element, result, resolver);
            if (r == null) return null;
            if (!element.IsAbstract)
            {
                var idNode = new RtField
                {
                    Identifier = new RtIdentifier("$id?"),
                    Type = resolver.ResolveTypeName(typeof(string))
                };
                var typeNode = new RtField
                {
                    Identifier = new RtIdentifier("$type?"),
                    Type = resolver.ResolveTypeName(typeof(string))
                };
                var refNode = new RtField
                {
                    Identifier = new RtIdentifier("$ref?"),
                    Type = resolver.ResolveTypeName(typeof(string))
                };
                r.Members.Insert(0, refNode);
                r.Members.Insert(0, typeNode);
                r.Members.Insert(0, idNode);
            }
            return r;
        }
    }
}