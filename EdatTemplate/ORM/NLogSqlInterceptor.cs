using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DiagnosticAdapter;
using NLog;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.SqlClient;

namespace EdatTemplate.ORM
{
    public class NLogSqlInterceptor
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        private static readonly IList<string> Commands = new List<string>();

        private static readonly object Lock = new object();

        [DiagnosticName("Microsoft.EntityFrameworkCore.Database.Command.CommandExecuting")]
        public void OnCommandExecuting(DbCommand command, DbCommandMethod executeMethod, Guid commandId, Guid connectionId, bool async, DateTimeOffset startTime)
        {
            Log(command);
        }

        [DiagnosticName("Microsoft.EntityFrameworkCore.Database.Command.CommandExecuted")]
        public void OnCommandExecuted(object result, bool async)
        {

        }

        private static void Log(DbCommand command)
        {
            //this method creats an executable SQL script (Logs/sql.log) for DBAs to review the SQL of the application
            lock (Lock)
            {
                if (Commands.Contains(command.CommandText))
                {
                    return;
                }
                Commands.Add(command.CommandText);
            }
            if (command.Parameters.Count > 0)
            {
                Logger.Info($"--Parameters:");
            }
            foreach (DbParameter param in command.Parameters)
            {
                var sqlParam = (SqlParameter)param;
                Logger.Info($"declare {(sqlParam.ParameterName.StartsWith("@") ? "" : "@")}{sqlParam.ParameterName} {sqlParam.SqlDbType.ToString().ToLower()} {(sqlParam.Size > 0 ? "(" + sqlParam.Size + ")" : "")}");
                Logger.Info($"set {(sqlParam.ParameterName.StartsWith("@") ? "" : "@")}{sqlParam.ParameterName} = '{sqlParam.SqlValue}'");
            }
            if (command.Parameters.Count > 0)
            {
                Logger.Info(Environment.NewLine);
            }
            Logger.Info($"--Query:{Environment.NewLine}{command.CommandText}");
            Logger.Info(Environment.NewLine);
        }
    }
}